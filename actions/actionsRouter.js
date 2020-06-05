const express = require('express')
const Projects = require('../data/helpers/projectModel.js')
const Actions = require('../data/helpers/actionModel.js')

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