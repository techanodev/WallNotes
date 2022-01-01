import React from 'react'
import { io, Socket } from 'socket.io-client'
import Note from '../components/Note'
import { NoteType } from '../types/NoteType'

type State = {
    notes: NoteType[]
    otherNotes: NoteType[]
}

export default class Home extends React.Component<{}, State> {

    readonly colorPicker: React.RefObject<HTMLInputElement>
    private socket?: Socket

    constructor(props: {}) {
        super(props)
        this.state = { notes: [], otherNotes: [] }
        this.colorPicker = React.createRef<HTMLInputElement>()
    }

    componentDidMount() {
        this.socket = io('http://api.roovie.techanodev.ir')
        this.socket.on('notes', (notes: NoteType[]) => {
            this.setState({ otherNotes: notes })
        })

    }

    addNewNote() {
        const notes = this.state.notes
        notes.push({ x: 0, y: 0, text: "" })
        this.setState({ notes: notes })
    }

    deleteNote(index: number) {
        const notes = this.state.notes
        notes.splice(index, 1)
        this.setState({ notes: notes })
    }

    onChange(index: number, note: NoteType) {
        const notes = this.state.notes
        notes[index] = note
        this.setState({ notes: notes })
        this.socket?.emit('notes', notes)
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

    render() {
        return (<>
            <div>
                {this.state.notes.map((note: NoteType, index: number) => (
                    <Note
                        note={note}
                        onDelete={() => this.deleteNote(index)}
                        onChange={note => this.onChange(index, note)}
                        onClick={() => this.onClick(index)}
                        readonly={false}
                    />
                ))}
                {this.state.otherNotes.map((note: NoteType) => (
                    <Note
                        note={note}
                        readonly={true}
                    />
                ))}
            </div>


            <button
                className="btn btn-primary rounded-circle add"
                onClick={() => this.addNewNote()}
            >
                +
            </button>
        </>)
    }
}