import React from 'react'
import { io, Socket } from 'socket.io-client'
import Note from '../components/Note'
import { NoteType } from '../types/NoteType'

type State = {
    notes: NoteType[]
    otherNotes: { [id: string]: NoteType[] }
}

export default class Home extends React.Component<{}, State> {

    readonly colorPicker: React.RefObject<HTMLInputElement>
    private socket?: Socket

    constructor(props: {}) {
        super(props)
        this.state = { notes: [], otherNotes: {} }
        this.colorPicker = React.createRef<HTMLInputElement>()
    }

    componentDidMount() {
        this.socket = io('http://api.roovie.techanodev.ir')
        this.socket.on('notes', (notes) => {
            this.setState({ otherNotes: notes })
        })

        window.onbeforeunload = function (event) {
        };


        // alert("کافیه برای اضافه کردن یک نوت انگشت خود را نگه دارید یا کلیک راست کنید.")
    }

    mobileCheck() {
        return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    };

    addNewNote(e?: React.MouseEvent) {
        const audio = new Audio('/audios/new-paper.wav')
        audio.play().then(() => {
            const notes = this.state.notes
            console.log(e)
            notes.push({ x: e?.clientX ?? 0, y: e?.clientY ?? 0, text: "", updatedAt: new Date(), createdAt: new Date() })
            this.setState({ notes: notes })
            this.socket?.emit('notes', this.state.notes)
        })
    }

    deleteNote(index: number) {
        const notes = this.state.notes
        notes.splice(index, 1)
        this.setState({ notes: notes })
        this.socket?.emit('notes', this.state.notes)
    }

    onChange(index: number, note: NoteType) {
        const notes = this.state.notes
        notes[index] = note
        this.setState({ notes: notes })
        this.socket?.emit('notes', this.state.notes)
    }

    onClick(index: number) {
        const notes = this.state.notes
        if (index < notes.length - 1) {
            const oldNote = this.state.notes[index]
            notes.splice(index, 1)
            notes.push(oldNote)
            this.setState({ notes: notes })
        }
    }

    onContextMenu(e: React.MouseEvent) {
        if (!this.mobileCheck()) return
        this.addNewNote(e)
    }

    render() {
        return (<div className='home'>
            <div
                className='container'
                onContextMenu={(e) => this.onContextMenu(e)}
                onDoubleClick={(e) => this.addNewNote(e)}
            ></div>
            <div className='notes'>
                {Object.values(this.state.otherNotes).flat().map((note: NoteType) => (
                    <Note
                        note={note}
                        readonly={true}
                    />
                ))}
                {this.state.notes.map((note: NoteType, index: number) => (
                    <Note
                        note={note}
                        onDelete={() => this.deleteNote(index)}
                        onChange={note => this.onChange(index, note)}
                        onClick={() => this.onClick(index)}
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