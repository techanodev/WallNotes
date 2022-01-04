import Note from "../models/notes.models";
import ResponseService from '../services/response.services'
import { Request, Response } from 'express'
import { NoteResource } from "../resources/notes.resources";
import TokenService from "../services/token.services";
import RequestService from "../services/requests.services";

export default class NoteController {
    static list = async (req: Request, res: Response) => {
        try {
            const request = new RequestService(req)
            const pagination = request.pagination({ countPerPage: 100, page: 1 })
            const skip = (pagination.page - 1) * pagination.countPerPage
            const notes = await Note.find({}, {}, { skip: skip, limit: pagination.countPerPage })
            const response = new ResponseService(res)
            const userId = await TokenService.token(req.headers.token as string)
            response.set('notes', NoteResource.collection(notes, userId))
            response.setStatus(true)
            response.response()
        } catch (e) {
            ResponseService.handleError(res, e)
        }
    }
}