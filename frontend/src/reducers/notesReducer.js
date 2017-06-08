import initialState from './initialState';

const reducers = {
    LOAD_NOTES: (state, action) => {
        return action.notes;
    },

    ADD_NOTE: (state, action) => {
        return [
            ...state,
            action.note
        ];
    },

    EDIT_NOTE: (state, action) => {
        return [
            ...state.filter(note => note.id !== action.note.id),
            Object.assign({}, action.note)
        ];
    },

    DELETE_NOTE: (state, action) => {
        return [
            ...state.filter(note => note.id !== action.note.id)
        ];
    },
}

export default (state = initialState.notes, action) => {
    return action.type in reducers 
        ? reducers[action.type](state, action)
        : state;
}