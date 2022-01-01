import React from 'react'
import { TwitterPicker } from 'react-color'
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
        // this.colorPicker.current?.click()
        this.onColorChanged()
    }

    onColorChanged() {
        console.log("ok")
        const notes = this.state.notes
        notes.push({ x: 0, y: 0, text: "" })
        this.setState({ notes: notes })
    }

    render() {
        return (<>
            {this.state.notes.map(note => (
                <Note />
            ))}

            <input
                className="btn rounded-circle add outline-none d-none"
                type="color"
                ref={this.colorPicker}
                onBlur={() => this.onColorChanged()}
            />


            <button
                className="btn btn-primary rounded-circle add"
                onClick={() => this.addNewNote()}
            >
                +
            </button>
        </>)
    }
}