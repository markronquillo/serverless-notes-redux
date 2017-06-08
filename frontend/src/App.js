import React, { Component } from 'react';

import {
  withRouter,
  Link
} from 'react-router-dom';
import {
  Nav,
  Navbar,
  NavItem
} from 'react-bootstrap';

import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';

import AWS from 'aws-sdk';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';

import { getCognitoUserPoolInstance } from './libs/awsLib';

import { connect } from 'react-redux';
import * as actions from './actions/';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.handleNavLink = this.handleNavLink.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentDidMount() {
    this.props.loadToken();
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleLogout(event) {
    const currentUser = getCognitoUserPoolInstance().getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }

    if (AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
    }

    this.props.logout();

    this.props.history.push('/login');
  }

  render() {
    return  ! this.props.auth.isLoadingToken
      && (
        <div className="App container">
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">Scratch</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                { this.props.auth.token
                  ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                  : [
                    <RouteNavItem key={1} onClick={this.handleNavLink} href="/signup">Signup</RouteNavItem>,
                    <RouteNavItem key={2} onClick={this.handleNavLink} href="/login">Login</RouteNavItem>
                  ]
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes token={this.props.auth.token} />
        </div>
      );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    ...state    
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(actions.logout()),
    loadToken: () => dispatch(actions.loadToken()),
    saveToken: (token) => dispatch(actions.saveToken(token)),
    login: (credentials) => dispatch(actions.login(credentials)),
    signup: (information) => dispatch(actions.signup(information)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

