const express = require('express')
const helmet = require('helmet')

const projectsRouter = require('./projects/projectsRouter')
const actionsRouter = require('./actions/actionsRouter')

const server = express()

const port = process.env.PORT || 6000

function logger(req, res, next) {
     const seconds = new Date().getSeconds()
     const minutes = new Date().getMinutes()
     console.log(`|| Method: ${req.method} `, `| URL: http://localhost:${port}${req.url} `, `| Timestamp: ${minutes} minutes and ${seconds} seconds ||`)
     next()
}

server.use(helmet())
server.use(express.json())
server.use(logger)
server.use(`/api/projects`, projectsRouter)
server.use(`/api/actions`, actionsRouter)

server.get(`/`, (req, res) => {
     res.status(200).json({
          environment: process.env.NODE_ENV,
          port: process.env.PORT
     })
})


module.exports = server