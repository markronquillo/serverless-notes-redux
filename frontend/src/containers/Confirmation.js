import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	HelpBlock,
	FormGroup,
	FormControl,
	ControlLabel
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';

import {
	CognitoUser,
} from 'amazon-cognito-identity-js';

import './Signup.css';

import { confirm, authenticate, getCognitoUserPoolInstance } from '../libs/awsLib';

import { connect } from 'react-redux';

import * as actions from '../actions/index';

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

	componentWillMount() {
		if ( ! this.props.confirmationAccount) {
			this.props.history.push('/login');
		}
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

		this.props.setIsLoading(true);
		try {
			const userPool = getCognitoUserPoolInstance() ;

			var userData = {
	      Username : this.props.confirmationAccount.username,
        Pool : userPool
	    };

	    const user = new CognitoUser(userData);

			await confirm(user, this.state.confirmationCode);

			const userToken = await authenticate(
				user,
				this.props.confirmationAccount.username,
				this.props.confirmationAccount.password
			);

			this.props.saveToken(userToken);
			this.props.history.push('/');
		}
		catch(e) {
			alert(e);
		}
		this.props.setIsLoading(false);
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
							value={this.props.confirmationCode}
							onChange={this.handleChange} />
						<HelpBlock> 
							Please check your email or the code.
						</HelpBlock>
						<HelpBlock> 
							email: {this.props.confirmationAccount && this.props.confirmationAccount.username}
						</HelpBlock>
					</FormGroup>

					<LoaderButton
						block
						bsSize="large"
						disabled={ ! this.validateConfirmationForm() }
						type="submit"
						isLoading={this.props.isLoading}
						text="Verify"
						loadingText="Verifying..."
						/>
				</form>
			</div>
		);
	}

}

function mapStateToProps(state, ownProps) {
  return {
		confirmationAccount: state.auth.confirmationAccount,
    isLoading: state.isLoading
  }
}

function mapDispatchToProps(dispatch) {
  return {
  	saveToken: (token) => dispatch(actions.saveToken(token)),
    setIsLoading: (value) => dispatch(actions.setIsLoading(value)),
		setConfirmationAccount: (account) => dispatch(actions.setConfirmationAccount(account)),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Confirmation));

