import React from 'react'
import { toast } from 'react-toastify'
import { io, Socket } from 'socket.io-client'
import LoginModal from '../components/modals/LoginModal'
import Note from '../components/Note'
import { NoteType } from '../types/NoteType'
import Auth from '../utils/Auth'
import Request from '../utils/Request'

type State = {
    userNotes: NoteType[]
    notes: { [id: string]: NoteType }
    isWide: boolean,
    userId: string
    page: number
}

export default class Home extends React.Component<{}, State> {

    readonly colorPicker: React.RefObject<HTMLInputElement>
    private socket?: Socket

    constructor(props: {}) {
        super(props)
        this.state = { userNotes: [], notes: {}, isWide: false, userId: '', page: 1 }
        this.colorPicker = React.createRef<HTMLInputElement>()
    }

    addNoteToState(note: NoteType) {
        const notes = this.state.userNotes
        notes.push(note)
        this.setState({ userNotes: notes })
    }

    removeNoteFromState(id: string) {
        let notes = this.state.userNotes
        let allNotes = this.state.notes
        notes = notes.filter(x => x.id != id)
        delete allNotes[id]
        this.setState({ userNotes: notes, notes: allNotes })
    }

    mobileCheck() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    };

    addNewNote(e?: React.MouseEvent) {
        const audio = new Audio('/audios/new-paper.wav')
        audio.play().then(() => {
            this.socket?.emit('create', { x: e?.clientX ?? 0, y: e?.clientY ?? 0 })
        })
    }

    deleteNote(index: number) {
        this.socket?.emit('delete', this.state.userNotes[index].id)
    }

    onChange(index: number, note: NoteType) {
        const notes = this.state.userNotes
        notes[index] = note
        this.setState({ userNotes: notes })
        this.socket?.emit('change', note)
    }

    onMove(index: number, note: NoteType) {
        const notes = this.state.userNotes
        notes[index] = note
        this.setState({ userNotes: notes })
        this.socket?.emit('move', note)
    }

    onContextMenu(e: React.MouseEvent) {
        if (!this.mobileCheck()) return
        this.addNewNote(e)
    }

    onAuth() {
        const token = process.env.REACT_APP_SERVER ?? ''
        this.socket = io(token, { auth: { token: Auth.getToken() } })
        this.setState({ isWide: true })
        this.socket.on('user-note', (note) => {
            const notes = this.state.notes
            notes[note.id] = note
            this.setState({ notes: notes })
        })

        this.socket.on('note', (note) => {
            console.log(note)
            this.addNoteToState(note)
        })

        this.getData()

        this.socket.on('user-note', (note) => {
            console.log(note)
        })

        this.socket.on('delete', (id) => {
            console.log(`${id} has removed from database`)
            this.removeNoteFromState(id)
        })

        this.socket.on('error', error => {
            console.error(error)
            if (error.message) {
                toast.error(error.message)
            }
        })
    }

    getData() {
        Request.send(`v1/notes?page=${this.state.page}`, { method: 'GET', headers: { token: Auth.getToken() as string } }).then(val => {
            if (!val.data.status) return
            const notes: NoteType[] = val.data.notes

            this.setState({ page: this.state.page + 1 })

            if (notes.length) {
                this.getData()
            } else {
                return
            }

            const myNotes = this.state.userNotes
            const notesResult: { [id: string]: NoteType } = this.state.notes
            for (const note of notes) {
                if (note.own) {
                    myNotes.push(note)
                    continue
                }
                notesResult[note.id] = note
            }
            this.setState({ notes: notesResult, userNotes: myNotes })
        }).catch(e => {
            console.error(e)
            toast.error('خطا در دریافت اطلاعات نوت ها')
        })
    }

    render() {
        return (<div className='home' style={this.state.isWide ? { minWidth: 2500, minHeight: 2500 } : {}}>

            <LoginModal onAuth={() => this.onAuth()} />

            <div
                className='container'
                onContextMenu={(e) => this.onContextMenu(e)}
                onDoubleClick={(e) => this.addNewNote(e)}
            ></div>
            <div className='notes'>
                {Object.values(this.state.notes).flat().map((note: NoteType) => (
                    <Note
                        note={note}
                        readonly={true}
                    />
                ))}
                {this.state.userNotes.map((note: NoteType, index: number) => (
                    <Note
                        note={note}
                        onDelete={() => this.deleteNote(index)}
                        onChange={note => this.onChange(index, note)}
                        onMove={note => this.onMove(index, note)}
                        readonly={false}
                    />
                ))}
            </div>


            <button
                className="btn btn-primary rounded-circle add"
                onClick={() => this.addNewNote()}
            >
                +
            </button>
        </div >)
    }
}