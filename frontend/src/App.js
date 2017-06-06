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

import { CognitoUserPool, } from 'amazon-cognito-identity-js';
import config from './config.js';

import AWS from 'aws-sdk';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      isLoadingUserToken: true,
      emailConfirmation: null
    };

    // this.handleNavLink = this.handleNavLink.bind(this);
    this.updateUserToken = this.updateUserToken.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.getUserToken = this.getUserToken.bind(this);
    this.setConfirmationAccount = this.setConfirmationAccount.bind(this);
  }

  async componentDidMount() {
    const currentUser = this.getCurrentUser();

    if (currentUser === null) {
      this.setState({ isLoadingUserToken: false });
      return;
    }

    try {
      const userToken = await this.getUserToken(currentUser);
      this.updateUserToken(userToken);
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isLoadingUserToken: false });
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  updateUserToken(userToken) {
    this.setState({
      userToken: userToken
    }) 
  }

  handleLogout(event) {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }

    this.updateUserToken(null);

    if (AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
    }

    this.props.history.push('/login');
  }

  getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });

    return userPool.getCurrentUser();
  }

  getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession(function(err, session) {
        if (err) {
          reject(err);
          return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    })
  }

  setConfirmationAccount(account) {
    this.setState({ confirmationAccount: account});
  }

  render() {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this.updateUserToken,
      confirmationAccount: this.state.confirmationAccount,
      setConfirmationAccount: this.setConfirmationAccount
    };

    return  ! this.state.isLoadingUserToken
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
                { this.state.userToken
                  ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                  : [
                    <RouteNavItem key={1} onClick={this.handleNavLink} href="/signup">Signup</RouteNavItem>,
                    <RouteNavItem key={2} onClick={this.handleNavLink} href="/login">Login</RouteNavItem>
                  ]
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      );
  }
}

export default withRouter(App);

