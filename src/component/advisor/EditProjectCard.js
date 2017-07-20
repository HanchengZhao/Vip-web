import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardMedia, CardTitle, CardHeader, CardText} from 'material-ui/Card';
import firebase from '../../firebase'
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Primary, {university, validDomain} from '../../Theme';
import {Validation} from './../../Validation';
import MuiTable from '../MuiTable';

class EditProjectCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      teamName: this.props.project.title,
      subtitle: this.props.project.subtitle,
      topics: this.props.project.topics,
      advisor: this.props.project.advisor,
      desc: this.props.project.desc,
      major: this.props.project.major,
      requirements: this.props.project.requirements,
      members: this.props.project.members,
      name: this.props.project.name,
      email: this.props.project.email,
      status: this.props.project.status,
      teamLogo: this.props.project.logo,
      sections:this.props.project.sections,
      validEmail:'',
      emailMessage:'',
      fbKey : this.props.fbKey,
      open:false,
      dialog:false,
      roster:true,
      Redirect:false,
      Students: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.fbWrite = this.fbWrite.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.dialogClose = this.dialogClose.bind(this);
    this.dialogOpen = this.dialogOpen.bind(this);
    this.openRoster = this.openRoster.bind(this);
  }

  componentDidMount() {
    let fbRef = firebase.database().ref(`Student/${this.state.teamName.split(' ').join('')}`);
    fbRef.on('value', (snap) => {
      this.setState({
        Students:snap.val()
      });
    });
  }

  handleChange(e) {
    let id = e.target.id;
    this.setState({[id]:e.target.value});
    Validation(this.state.email);
  }

  handleClose() {
    this.setState({
      open:false,
      roster:true
    });
  }

  handleOpen() {
    this.setState((prevState, props) => (
      {open:!prevState.open,
      roster:false}
    ));
  }

  openRoster() {
    this.setState((prevState, props) => (
      {roster:!prevState.roster}
    ));
  }

  dialogClose() {
    this.setState({
      dialog:false,
      Redirect:true,
    });
  }

  dialogOpen() {
    this.setState({
      dialog:true
    }, this.handleClose());
  }

  fbWrite() {
    if(Validation(this.state.email)) {
      firebase.database().ref(`Teams/${this.state.fbKey}`).set({
        desc:this.state.desc,
        title:this.state.teamName,
        subtitle:this.state.subtitle,
        topics:this.state.topics,
        members:this.state.members,
        name:this.state.name,
        email:this.state.email,
        status:this.state.status,
        logo:this.state.teamLogo,
        major:this.state.major,
        requirements:this.state.requirements,
        advisor:this.state.advisor,
        sections: [
                    {'content':this.state.major,'title': 'Major'},
                    {'content':this.state.requirements,'title': 'Requirements'},
                    {'content':this.state.advisor,'title': 'Advisor'}],
      });
    this.dialogOpen();
    this.setState({
        emailMessage:"" 
      });
    }else{
      this.setState({
        emailMessage:"Please Enter A Valid " + university + " Email" 
      });
    }
  }

  render() {
    let keys = Object.keys(this.props.project);
    let items = keys.map((key) => {
      if (['sections', 'title', 'logo'].includes(key)){
        return null;
      }
      if(key==='email') {
        return(
          <div key = {key}>
          <h3>{key}</h3>
          <TextField id = {key} errorText = {this.state.emailMessage} defaultValue = {this.props.project[key]} multiLine = {true} onChange = {this.handleChange} rows = {2} fullWidth = {true}/> 
        </div>
        );
      }

      return(
        <div key = {key}>
          <h3>{key}</h3>
          <TextField id = {key} defaultValue = {this.props.project[key]} multiLine = {true} onChange = {this.handleChange} rows = {2} fullWidth = {true}/> 
        </div>
      );
    });

    return(
      <div>
        <MuiThemeProvider>
          <div>
            <Card expandable = {true} expanded={this.state.open}>
              <CardTitle title = {this.props.project.title} subtitle = {this.props.project.subtitle} />
              <CardText expandable = {true}>
                <FlatButton label = "Edit Info" onClick = {this.openRoster} style = {{float:"right", paddingBottom:"20px"}}/>
                {this.state.roster
                ?<div>
                  {items}
                  <div style = {{float:"right"}}>
                    <FlatButton label = "cancel" onClick = {this.handleClose}/>
                    <FlatButton label = "save" onClick = {this.fbWrite}/>
                  </div>
                </div>
                :<h3>Roster</h3>
                }
                <br />
                
              </CardText>
              <CardActions>
                <FlatButton label = "View Roster" onClick = {this.handleOpen}/>
              </CardActions>
            </Card>
            <Dialog
              title="Your Updates Have Been Saved!"
              open={this.state.dialog}
              onRequestClose={this.dialogClose}
              style = {{textAlign:"center"}}
            />
          </div>
        </MuiThemeProvider>
        {this.state.Redirect && (
        <Redirect to = "/dashboard" />)
        }
      </div>
    );
  }

}

export default EditProjectCard;