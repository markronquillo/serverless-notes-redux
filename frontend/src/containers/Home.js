import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';

import './Home.css';

import * as actions from '../actions/index';

import { connect } from 'react-redux';


class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.token) 
      this.props.loadNotes(this.props.token);
  }

  renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) => (
      i !== 0
        ? (<ListGroupItem
            key={note.noteId}
            href={`/notes/${note.noteId}`}
            onClick={this.handleNoteClick}
            header={note.content.trim().split('\n')[0]}>
          </ListGroupItem> )
        : ( <ListGroupItem
              key="new"
              href="/notes/new"
              onClick={this.handleNoteClick}>
                <h4><b>{'\uFF0B'}</b> Create a new note</h4>
            </ListGroupItem>
          )
    ));
  }

  handleNoteClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  renderNotes() {
    return (
      <div className="notes">
        <PageHeader>Your Notes</PageHeader>
        <ListGroup>
          { ! this.props.isLoading
            && this.renderNotesList(this.props.notes) }
        </ListGroup>
      </div>
    )
  }

  render() {
    return (
      <div className="Home">
        { this.props.token === null
          ? this.renderLander()
          : this.renderNotes()
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.auth.token,
    isLoading: state.isLoading,
    notes: state.notes,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadNotes: (token) => dispatch(actions.beginLoadNotes(token)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
