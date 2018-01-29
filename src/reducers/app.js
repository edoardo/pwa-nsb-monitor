export const actionTypes = {
    APP_SET_SERVICE_WORKER: 'APP_SET_SERVICE_WORKER',
};

const initialState = {
    serviceWorker: navigator.serviceWorker,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.APP_SET_SERVICE_WORKER:
            return {
                ...state,
                serviceWorker: action.payload,
            };
        default:
            return state;
    }
};
