const express = require('express')
const Projects = require('../data/helpers/projectModel.js')
const Actions = require('../data/helpers/actionModel.js')

const router = express.Router()

//GETs
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

//POSTs
router.post(
     `/`, 
     requiredProperty('name'),
     requiredProperty('description'), 
     (req, res) => {
          const newProject = req.body
          Projects.insert(newProject)
               .then(postedNewProject => {
                    res.status(201).json({
                         message: 'Project successfully posted!',
                         postedNewProject
                    })
               })
               .catch(err => {
                    console.log(err)
                    res.status(500).json({
                         message: 'Error occurred during posting',
                         error: err
                    })
               })
})

router.post(
     `/:id/actions`, 
     validateProjectId, 
     requiredProperty('description'), 
     requiredProperty('notes'),
     (req, res) => {
          const projectId = req.params.id
          const newAction = {
               ...req.body,
               project_id: Number(projectId)
          }
          if(newAction.description.length > 128){
               res.status(400).json({
                    message: 'Maximum description character limit: 128'
               })
          } else {
               Actions.insert(newAction)
                    .then(postedNewAction => {
                         res.status(201).json({
                              message: 'Action added successfully',
                              postedNewAction
                         })
                    })
                    .catch(err => {
                         console.log(err)
                         res.status(500).json({
                              message: 'Error occurred while posting'
                         })
                    })
          }
     }
)

//DELETEs
router.delete(`/:id`, validateProjectId, (req, res) => {
     const projectId = req.params.id
     Projects.remove(projectId)
          .then(numberOfDeletedProjects => {
               if(numberOfDeletedProjects === 1){
                    res.status(200).json({
                         message: 'Successfully deleted',
                         numberOfDeletedProjects
                    })
               } else {
                    res.status(500).json({
                         message: 'Looks like you could not remove this post'
                    })
               }
          })
          .catch(err => {
               console.log(err)
               res.status(500).json({
                    message: 'Looks like you could not remove this post',
                    error: err
               })
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

function requiredProperty(property){
     return (req, res, next) => {
       if(!req.body[property]){
         res.status(400).json({
           message: `Needs to include a required ${property} property`
         })
       } else {
       next()
       }
     }
}

module.exports = router