import express from 'express'
import { AdminRoutes, UserRoutes, PostRoutes, TagRoutes, CommentsRoutes, AnserRoutes } from '../routes/index.js'

export default async function App(app) {

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.use('/api', AdminRoutes)
    app.use('/api', UserRoutes)
    app.use('/api', PostRoutes)
    app.use('/api', TagRoutes)
    app.use('/api', CommentsRoutes)
    app.use('/api', AnserRoutes)

    return app

}