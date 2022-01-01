import React from 'react'
import Note from '../components/Note'
import { NoteType } from '../types/NoteType'

type State = {
    notes: NoteType[]
}

export default class Home extends React.Component<{}, State> {

    readonly colorPicker: React.RefObject<HTMLInputElement>

    constructor(props: {}) {
        super(props)
        this.state = { notes: [] }
        this.colorPicker = React.createRef<HTMLInputElement>()
    }

    addNewNote() {
        console.log("ok")
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
        console.log(note)
    }

    render() {
        return (<>
            <div>
                {this.state.notes.map((note: NoteType, index: number) => (
                    <Note note={note} onDelete={() => this.deleteNote(index)} onChange={note => this.onChange(index, note)} />
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