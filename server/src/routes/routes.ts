import express, { Express } from 'express'
import V1Routes from './v1/v1'

/**
 * Default routes for api app
 */
export default class Routes {
    /**
     * Init data for app routes
     * @param {Express} app
     */
    public static init(app: Express): void {
        app.use('/v1', V1Routes)
    }
}