import jwt = require('jsonwebtoken')

export default class TokenService {
    static token(token: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const privateKey = process.env.APP_SECRET_KEY ?? ''

            jwt.verify(token, privateKey, (err: any, decoded: any) => {
                if (err) {
                    return reject(err)
                }
                resolve(decoded.userId)
            })
        })
    }
}