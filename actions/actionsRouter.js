const express = require('express')
const Projects = require('../data/helpers/projectModel.js')
const Actions = require('../data/helpers/actionModel.js')

require('dotenv').config();
const port = process.env.PORT || 6000;

const router = express.Router()

//GETs
router.get(`/`, (req, res) => {
     Actions.get()
     .then(actionsArray => {
          res.status(200).json(actionsArray)
     })
     .catch(err => {
          console.log(err)
          res.status(500).json({
               error: err,
               message: 'Error occured while fetching data'
          })
     })
})

router.get(`/:id`, validateActionId, (req, res) => {
     const action = req.action
     res.status(200).json(action)
})

// POSTs
router.post(
     `/`,
     requiredProperty('project_id'),
     requiredProperty('description'),
     requiredProperty('notes'),
     (req, res) => {
          const newAction = req.body
          let projectId = req.body.project_id
          router.get(`http://localhost:${port}/${projectId}`, validateProjectId, (req, res) => {
               const project = req.project
               res.status(200).json(project)
          })
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
                         message: 'Error occurred while posting, make sure the project_id exists'
                    })
               })
          }
     })

     router.delete(`/:id`, validateActionId, (req, res) => {
          const actionId = req.params.id
          Actions.remove(actionId)
               .then(numberOfDeletedActions => {
                    if(numberOfDeletedActions === 1){
                         res.status(200).json({
                              message: 'Successfully deleted',
                              numberOfDeletedActions
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

     router.put(
          `/:id`, 
          validateActionId, 
          requiredProperty('project_id'),
          requiredProperty('description'),
          requiredProperty('notes'),
          (req, res) => {
               const actionId = req.params.id
               const actionUpdates = {
                    ...req.body,
                    id: actionId
               }
               if(actionUpdates.description.length > 128){
                    res.status(400).json({
                         message: 'Maximum description character limit: 128'
                    })
               } else {
               Actions.update(actionId, actionUpdates)
                    .then(updatedAction => {
                         res.status(200).json({
                              message: 'Action Successfully updated',
                              updatedAction
                         })
                    })
                    .catch(err => {
                         console.log(err)
                         res.status(500).json({
                              message: 'Error occurred during updates, make sure you did not change the project_id',
                              error: err
                         })
                    })
               }
          })

//middleware
function validateActionId(req, res, next) {
     Actions.get(req.params.id)
          .then(action => {
               if(action){
                    req.action = action
                    next()
               } else {
                    res.status(404).json({
                         message: 'Action not found, sry'
                    })
               }
          })
          .catch(err => {
               console.log(err)
               res.status(500).json({
                    error: err,
                    message: 'Error retrieving the action'
               })
          })
}

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