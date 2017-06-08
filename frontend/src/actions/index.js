import axios from 'axios';
import * as actionTypes from './actionTypes';

import config from '../config';
import { 
    invokeApiGateway, 
    getUserToken, 
    getCognitoUserPoolInstance } from '../libs/awsLib';

///////////////////////////////////////////////////////////////////////////////

export function setIsLoading(isLoading) {
    return {
        type: actionTypes.SET_IS_LOADING,
        isLoading
    }
}

export function login(credentials) {
    return {
        type: actionTypes.LOGIN,
        credentials
    };
}

export function signup(information) {
    return {
        type: actionTypes.SIGNUP,
        information
    };
}

export function logout() {
    return {
        type: actionTypes.LOGOUT,
    };
}

export function setConfirmationAccount(credentials) {
    return {
        type: actionTypes.SET_CONFIRMATION_ACCOUNT,
        confirmationAccount: credentials
    }
}
/////////////////////////////////////////////////////////////////////////////////

export function loadToken() {
    return async function (dispatch) {
        dispatch(setIsLoadingToken(true));

        const userPool = getCognitoUserPoolInstance();
        const currentUser = userPool.getCurrentUser();

        if (currentUser === null) {
            dispatch(setIsLoadingToken(false));
            return;
        }

        try {
            const userToken = await getUserToken(currentUser);
            dispatch(saveToken(userToken));
        }
        catch(e) {
            console.log(e);
        }

        dispatch(setIsLoadingToken(false));
    };
}

export function setIsLoadingToken(isLoadingToken) {
    return {
        type: actionTypes.SET_IS_LOADING_TOKEN,
        isLoadingToken
    }    
}

export function saveToken(token) {
    return {
        type: actionTypes.SAVE_TOKEN,
        token
    };
}

/////////////////////////////////////////////////////////////////////////////////

export function beginLoadNotes(token) {
    return async function(dispatch) {
        dispatch(setIsLoading(true));
        try {
           const notes = await invokeApiGateway({ path: '/notes'}, token);
           dispatch(loadNotes(notes));
        } 
        catch(e) {
            console.log(e);
        }
        dispatch(setIsLoading(false));
    }
}

export function loadNotes(notes) {
    return {
        type: actionTypes.LOAD_NOTES,
        notes
    }
}

export function beginAddNote(note) {
    return async function(dispatch) {
        // ajax call
        dispatch(addNote(note));
    };
}

export function addNote(note) {
    return {
        type: actionTypes.ADD_NOTE,
        note
    }
}

export function beginEditNote(note) {
    return dispatch => {
        // ajax call
        dispatch(editNote(note));
    }
}

export function editNote(note) {
    return {
        type: actionTypes.EDIT_NOTE,
        note
    }
}

export function deleteNote(note) {
    return {
        type: actionTypes.DELETE_NOTE,
        note
    }
}

