import { Request, Response } from 'express'
import User from '../models/users.models'
import ResponseService from '../services/response.services'

import jwt = require('jsonwebtoken')

export default class UserController {
    static createGuestUser = async (req: Request, res: Response) => {
        try {
            const name = req.body.name

            if (!name) {
                return ResponseService
                    .newInstance(res)
                    .setMessage('نام برای کاربر وارد نمایید')
                    .setStatusCode(401)
                    .response()
            }

            let user = new User({ name: name })
            user = await user.save()
            console.log(`a user '${user.id}' has created`)
            const privateKey = process.env.APP_SECRET_KEY ?? ''
            const token = jwt.sign({ userId: user.id, name: name }, privateKey, { expiresIn: '30d' })
            ResponseService.newInstance(res).set('token', token).setStatus(true).response()
        } catch (e) {
            ResponseService.handleError(res, e)
        }
    }
}