import Note from "../models/notes.models";
import { Request, Response } from 'express'

export default class NoteController {
    static create(req: Request, res: Response) {
        const note = new Note({ coordinates: {} })
    }
}