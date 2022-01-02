import { Schema, model } from 'mongoose'

export interface NoteI {
    id?: string
    coordinates: {
        x: number
        y: number
    }
    text: string
    color?: string
}

export const NoteSchema = new Schema(
    {
        text: {
            type: String,
            required: false
        },
        coordinates: {
            type: {
                x: Number,
                y: Number
            },
            required: false
        },
        color: {
            type: 'string',
            required: false
        }
    },
    {
        timestamps: true
    }
)

const Note = model<NoteI>('Note', NoteSchema)


export default Note