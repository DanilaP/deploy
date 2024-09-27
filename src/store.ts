import { createStore } from 'redux';

const stateInitial = {
    user: null
};

function reducer(state = stateInitial, action) {
    switch(action.type) {
        case "USER": return { ...state, user: action.payload };

        default: return state;
    }
}

export const store = createStore(reducer);