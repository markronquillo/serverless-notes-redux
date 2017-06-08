import React, { Component } from 'react';
import {
	FormGroup,
	FormControl,
	ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';

import './Login.css';

import config from '../config.js';

import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { login } from '../libs/awsLib';

import * as actions from '../actions/index';

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
		};

        this.handleChange = this.handleChange.bind(this);
	}

	validateForm() {
		return this.state.username.length > 0
			&& this.state.password.length > 0;
	}

	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleSubmit = async (event) => {
		event.preventDefault();

    this.props.setIsLoading(true);
		try {
			const userToken = await login(this.state.username, this.state.password);
            this.props.saveToken(userToken)
            this.props.history.push('/');
		}
		catch(e) {
			if (e.code === "UserNotConfirmedException") {
				this.props.setConfirmationAccount({
					username: this.state.username,
					password: this.state.password
				});
				this.props.history.push('/confirmation');
        this.props.setIsLoading(false);
				return;
			}
      alert(e);
		}
    this.props.setIsLoading(false);
	}

	render() {
		return (
			<div className="Login">
         <form onSubmit={this.handleSubmit}>
           <FormGroup controlId="username" bsSize="large">
             <ControlLabel>Email</ControlLabel>
             <FormControl
               autoFocus
               type="email"
               value={this.state.username}
               onChange={this.handleChange} />
           </FormGroup>
           <FormGroup controlId="password" bsSize="large">
             <ControlLabel>Password</ControlLabel>
             <FormControl
               value={this.state.password}
               onChange={this.handleChange}
               type="password" />
           </FormGroup>
           <LoaderButton
          		block
          		bsSize="large" 
          		disabled={ ! this.validateForm() }
          		type="submit"
          		isLoading={this.props.isLoading}
          		text="Login"
          		loadingText="Logging in..." />
         </form>
       </div>
		);
	}
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.auth.token,
    isLoading: state.isLoading
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setIsLoading: (value) => dispatch(actions.setIsLoading(value)),
    setConfirmationAccount: (account) => dispatch(actions.setConfirmationAccount(account)),
    saveToken: (token) => dispatch(actions.saveToken(token)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

