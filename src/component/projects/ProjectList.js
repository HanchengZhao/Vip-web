import React, { Component } from 'react';
import ProjectCard from './ProjectCard';

import artgineer from '../../assets/team_logo/artgineer.png';
import crypto from '../../assets/team_logo/crypto.png'
import deeplearning from '../../assets/team_logo/deeplearning.jpg';

import firebase from '../../firebase';

class ProjectList extends Component {
    constructor() {
      super();
      this.state = {
        projects : ""
      }
    }

    componentDidMount(){
      const projectRef = firebase.database().ref('Teams');
      projectRef.on("value", (snap) => {
        this.setState({
          projects: snap.val()
        });
        console.log(snap.val())
      })
  }

    render () {
      let projects = this.state.projects;
      // this.state.projects.map((project,index) => 
      //           <ProjectCard key={index} project={project} />
      //         )
      return (
        <div className="row">
          { this.state.projects
            ? (Object.keys(this.state.projects).map((uuid) =>
                <ProjectCard key={uuid} fbkey={uuid} project={projects[uuid]} />
              ))
            : (<h2>Loading...</h2>)
          }
        </div>
      )
    }
}

export default ProjectList;