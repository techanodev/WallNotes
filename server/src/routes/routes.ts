import express from 'express'

const routes = express.Router()

routes.use((req, res) => {
    res.status(404).send('Not found !').end()
})

export default routes