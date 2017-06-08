import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	HelpBlock,
	FormGroup,
	FormControl,
	ControlLabel
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Signup.css';

import config from '../config.js';

import { signup } from '../libs/awsLib';

import { connect } from 'react-redux';

import * as actions from '../actions/index';

class Signup extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			username: '',
			password: '',
			confirmPassword: '',
			newUser: null,
		};

		this.validateForm = this.validateForm.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.renderForm = this.renderForm.bind(this);
	}

	validateForm() {
		return this.state.username.length > 0
			&& this.state.password.length > 0
			&& this.state.password === this.state.confirmPassword;
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
			const newUser = await signup(this.state.username, this.state.password);
			this.props.setConfirmationAccount({
				username: this.state.username,
				password: this.state.password
			});
			this.props.history.push('/confirmation');
		}
		catch(e) {
			alert(e);
		}
		this.props.setIsLoading(false);
	}

	renderForm() {
		return (
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
						autoFocus
						type="email"
						value={this.state.password}
						onChange={this.handleChange} 
						type="password" />
				</FormGroup>
				<FormGroup controlId="confirmPassword" bsSize="large">
					<ControlLabel>Confirm Password</ControlLabel>
					<FormControl
						autoFocus
						type="email"
						value={this.state.confirmPassword}
						onChange={this.handleChange} 
						type="password" />
				</FormGroup>
				<LoaderButton
					block
					bsSize="large"				
					disabled={ ! this.validateForm() }
					type="submit"
					isLoading={this.props.isLoading}
					text="Signup"
					loadingText="Signing up..." />
			</form>
		);
	}

	render() {
		return (
			<div className="Signup">
					{ this.renderForm() }
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
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signup));
