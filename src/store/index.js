import { configureStore } from '@reduxjs/toolkit';
import heroes from '../reducers/heroesReducer';


const stringMiddleware = () => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }
    return next(action)
};



const store = configureStore({
    reducer: {heroes},
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),
    devTools: process.env.NODE_ENV !== 'production'
})


export default store;