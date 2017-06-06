import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
	FormGroup,
	FormControl,
	ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config.js';
import './NewNote.css';

import { invokeApiGateway, s3Upload } from '../libs/awsLib';


class NewNote extends Component {
	constructor(props) {
		super(props);

		this.file = null;
		this.state = { 
			isLoading: null,
			content: '',
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleFileChange = this.handleFileChange.bind(this);
	}

	validateForm() {
		return this.state.content.length > 0;
	}

	handleChange = (event) => {
		this.setState({
			[event.target.id]: event.target.value
		});
	}

	handleFileChange = (event) => {
	  this.file = event.target.files[0];
	}

	handleSubmit = async (event) => {
		event.preventDefault();

		if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
			alert('Please pick a file smaller than 5MB');
			return;
		}

		this.setState({ isLoading: true });

		try {
			const uploadedFilename = (this.file)
				? (await s3Upload(this.file, this.props.userToken)).Location
				: null;

			console.log(uploadedFilename);

			await this.createNote({
				content: this.state.content,
				attachment: uploadedFilename
			});

			this.props.history.push('/');
		} catch(e) {
			alert(e);
			this.setState({ isLoading: false });
		}
	}

	createNote(note) {
		return invokeApiGateway({
			path: '/notes',
			method: 'POST',
			body: note,
		}, this.props.userToken);
	}

	render() {
		return (
			<div className="NewNote">
				<form onSubmit={this.handleSubmit}>
					<FormGroup controlId="content">
						<FormControl
							onChange={this.handleChange}
							value={this.state.content}
							componentClass="textarea" />
					</FormGroup>
					<FormGroup controlId="file">
						<ControlLabel>Attachment</ControlLabel>
						<FormControl
							onChange={this.handleFileChange}
							type="file" />
					</FormGroup>
					<LoaderButton
						block
						bsStyle="primary"
						bsSize="large"
						disabled={ ! this.validateForm() }
						type="submit"
						isLoading={this.state.isLoading}
						text="Create"
						loadingText="Creating..." />
				</form>
			</div>
		)
	}
}

export default withRouter(NewNote);
