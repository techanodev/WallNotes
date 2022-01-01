import express from 'express'

import routes from './routes/routes'
import http = require('http')
import cors = require('cors')
import NotesSockets from './sockets/notes.sockets'

require('dotenv').config()

const app = express()

app.use(cors)
app.use(routes)

const server = http.createServer(app)

const socket = new NotesSockets(server).setIo()

const port = Number.parseInt(process.env.APP_PORT ?? '8000')
const host = process.env.APP_HOST ?? '127.0.0.1'

server.listen(port, host, () => {
    console.log(`App started at http://${host}:${port}`)
})