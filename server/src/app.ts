import express from 'express'

import routes from './routes/routes'
import http = require('http')
import cors = require('cors')
import NotesSockets from './sockets/notes.sockets'
import mongoose from 'mongoose'

require('dotenv').config()

const app = express()

app.use(cors)
app.use(routes)

const server = http.createServer(app)

const socket = new NotesSockets(server)
socket.init()

const port = Number.parseInt(process.env.APP_PORT ?? '8000')
const host = process.env.APP_HOST ?? '127.0.0.1'

server.listen(port, host, () => {
    console.log(`App started at http://${host}:${port}`)
    mongoose.connect('mongodb://localhost:27017/myapp').catch(error => {
        console.error(error)
    }).then(result => {
        console.log(result)
    })
})