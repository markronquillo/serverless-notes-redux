import initialState from './initialState';
import * as actionTypes from '../actions/actionTypes';

export default function isLoadingReducer(state = initialState.isLoading, action) {
    switch(action.type) {
        case actionTypes.SET_IS_LOADING:
            return action.isLoading
        default:
            return state;
    }
}