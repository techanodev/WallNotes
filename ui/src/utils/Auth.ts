import Cookies from 'js-cookie'

export default class Auth {

    static getToken() {
        return Cookies.get('token')
    }

    static setToken(token: string) {
        Cookies.set('token', token, { expires: 365 })
    }

    static checkToken() {
        // const token = token;
    }
}