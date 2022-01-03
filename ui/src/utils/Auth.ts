import Cookies from 'js-cookie'

export default class Auth {

    static getToken() {
        return Cookies.get('token')
    }

    static setToken(token: string) {
        Cookies.set('token', token)
    }

    static checkToken() {
        // const token = token;
    }
}