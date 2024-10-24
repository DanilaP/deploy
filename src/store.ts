import { createStore } from 'redux';

const stateInitial = {
    user: null,
    permissions: {},
    allPermissions: [],
    draggablePermission: null
};

function reducer(state = stateInitial, action) {
    switch(action.type) {
        case "USER": return { ...state, user: action.payload };
        case "USERPERMISSIONS": return { ...state, permissions: action.payload };
        case "ALLPERMISSIONS": return { ...state, allPermissions: action.payload };
        case "SET_DRAGGABLE_PERMISSION": return { ...state, draggablePermission: action.payload };
        default: return state;
    }
}

export const store = createStore(reducer);