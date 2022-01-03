import axios, { AxiosRequestConfig } from "axios";

export default class Request {
    static send(url: string, config: AxiosRequestConfig) {
        url = process.env.REACT_APP_SERVER + url
        return axios.request({
            ...config,
            url: url
        })
    }
}