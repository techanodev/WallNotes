import { Request, Response } from 'express'
import ResponseService from '../services/response.services'

export default class Controller {
    static notFound = (_req: Request, res: Response) => {
        ResponseService
            .newInstance(res)
            .setMessage('request was not found !')
            .setStatusCode(404).response()
    }
}