import React from 'react'
import Note from '../components/Note'
import { NoteType } from '../types/NoteType'

type State = {
    notes: NoteType[]
}

export default class Home extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = { notes: [] }
    }

    addNewNote() {
        const notes = this.state.notes
        notes.push({ x: 0, y: 0, text: "" })
        this.setState({ notes: notes })
        console.log(notes)
    }

    render() {
        return (<>
            {this.state.notes.map(note => (
                <Note />
            ))}
            <button
                className="btn btn-primary rounded-circle add"
                onClick={() => this.addNewNote()}
            >
                +
            </button>
        </>)
    }
}