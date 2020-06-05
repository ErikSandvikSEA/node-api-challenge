import React, { useState, useEffect } from 'react'
import axios from 'axios'

const ProjectList = () => {
     const [ projects, setProjects ] = useState([])
     
     const fetchPosts = () => {
          axios.get(`http://localhost:8000/api/projects`)
                    .then(response => {
                         console.log(response.data)
                         setProjects(response.data)
                    })
                    .catch(err => {
                         console.log(err)
                    })
     }

     useEffect(() => {
          fetchPosts()
     }, [])

     return (
          <>
               {projects.map(project => {
                    return (
                         <div className='post-container' key={project.id}>
                              <h2>"{project.name}"</h2>
                              <h4>{project.description}</h4>
                              {/* {project.actions.map(action => {
                                   return (
                                        <div>{action}</div>
                                   )
                              })} */}
                         </div>
                    )
               })}
          </>
     )
}

export default ProjectList