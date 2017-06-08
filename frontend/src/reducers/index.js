import notes from './notesReducer';
import auth from './authReducer';
import isLoading from './isLoadingReducer';

import { combineReducers } from 'redux';

const reducers = combineReducers({
    auth,
    notes,
    isLoading,
});

export default reducers;