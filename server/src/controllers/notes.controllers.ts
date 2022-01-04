import Note from "../models/notes.models";
import ResponseService from '../services/response.services'
import { Request, Response } from 'express'
import { NoteResource } from "../resources/notes.resources";

export default class NoteController {
    static list = async (_req: Request, res: Response) => {
        try {
            const notes = await Note.find()
            const response = new ResponseService(res)
            response.set('notes', NoteResource.collection(notes))
            response.setStatus(true)
            response.response()
        } catch (e) {
            ResponseService.handleError(res, e)
        }
    }
}