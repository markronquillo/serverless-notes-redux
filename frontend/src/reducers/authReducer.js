import initialState from './initialState';

const reducers = {
    SAVE_TOKEN: (state, action) => {
        return {
            ...state,
            token: action.token
        }
    },

    DELETE_TOKEN: (state, action) => {
        return {
            ...state,
            token: null
        }
    },

    SET_IS_LOADING_TOKEN: (state, action) => {
        return {
            ...state,
            isLoadingToken: action.isLoadingToken
        }
    },

    SET_CONFIRMATION_ACCOUNT: (state, action) => {
        return {
            ...state,
            confirmationAccount: action.confirmationAccount
        }
    },

    LOGOUT: (state, action) => {
        return initialState.auth;
    }

};

export default (state = initialState.auth, action) => {
    return action.type in reducers
        ? reducers[action.type](state, action)
        : state;
}