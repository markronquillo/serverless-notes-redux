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

import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
} from 'amazon-cognito-identity-js';
import config from '../config.js';


class Confirmation extends Component {

	constructor(props) {
		super(props);

		this.state = {
			confirmationCode: ''
		};

		this.validateConfirmationForm = this.validateConfirmationForm.bind(this);
		this.handleConfirmationSubmit = this.handleConfirmationSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	validateConfirmationForm() {
		return this.state.confirmationCode.length > 0;
	}

	handleConfirmationSubmit = async (event) => {
		event.preventDefault();

		this.setState({ isLoading: true });

		try {
			const userPool = new CognitoUserPool({
				UserPoolId: config.cognito.USER_POOL_ID,
				ClientId: config.cognito.APP_CLIENT_ID
			});

			var userData = {
	        Username : this.props.confirmationAccount.username,
	        Pool : userPool
	    };

	    const user = new CognitoUser(userData);

			await this.confirm(user, this.state.confirmationCode);
			const userToken = await this.authenticate(
				user,
				this.props.confirmationAccount.username,
				this.props.confirmationAccount.password
			);

			this.props.updateUserToken(userToken);
			this.props.history.push('/');
		}
		catch(e) {
			alert(e);
			this.setState({ isLoading: false });
		}
	}

	confirm(user, confirmationCode) {

		return new Promise((resolve, reject) => (
			user.confirmRegistration(confirmationCode, true, function(err, result) {
				if (err) {
					reject(err);
					return;
				}
				resolve(result);
			})
		));
	}

	authenticate(user, username, password) {
		const authenticationData = {
			Username: username,
			Password: password
		};
		const authenticationDetails = new AuthenticationDetails(authenticationData)

		return new Promise((resolve, reject) => (
			user.authenticateUser(authenticationDetails, {
				onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
				onFailure: (err) => reject(err)
			})
		));
	}

	render() {
		return (
			<div className="Signup">
				<form onSubmit={this.handleConfirmationSubmit}>
					<FormGroup controlId="confirmationCode" bsSize="large">
						<ControlLabel>Confirmation Code</ControlLabel>
						<FormControl
							autoFocus
							type="tel"
							value={this.state.confirmationCode}
							onChange={this.handleChange} />
						<HelpBlock> 
							Please check your email or the code.
						</HelpBlock>
					</FormGroup>

					<LoaderButton
						block
						bsSize="large"
						disabled={ ! this.validateConfirmationForm() }
						type="submit"
						isLoading={this.state.isLoading}
						text="Verify"
						loadingText="Verifying..."
						/>
				</form>
			</div>
		);
	}

}

export default Confirmation;
