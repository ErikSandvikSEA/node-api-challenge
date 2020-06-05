const express = require('express')
const Projects = require('../data/helpers/projectModel.js')

const router = express.Router()

router.get(`/`, (req, res) => {
     Projects.get()
          .then(projectsArray => {
               res.status(200).json(projectsArray)
          })
          .catch(err => {
               console.log(err)
               res.status(500).json({
                    message: 'Error retrieving projects',
                    error: err
               })
          })
})

router.get(`/:id`, validateProjectId, (req, res) => {
     const project = req.project
     res.status(200).json(project)
})

router.get(`/:id/actions`, validateProjectId, (req, res) => {
     const projectId = req.params.id
     Projects.getProjectActions(projectId)
          .then(actionsArray => {
               res.status(200).json(actionsArray)
          })
})

//middleware
function validateProjectId(req, res, next) {
     Projects.get(req.params.id)
          .then(project => {
               if(project){
                    req.project = project
                    next()
               } else {
                    res.status(404).json({
                         message: 'Project not found, sry'
                    })
               }
          })
          .catch(err => {
               console.log(err)
               res.status(500).json({
                    error: err,
                    message: 'Error retrieving the project'
               })
          })
}

module.exports = router