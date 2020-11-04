import {applyMiddleware, combineReducers, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import {AUTH_STORE_KEY} from "../../apps/auth/state/auth.store";
import authReducer from '../../apps/auth/state/auth.reducer';

const rootReducers = {
  [AUTH_STORE_KEY]: authReducer
};

const reducer = combineReducers(rootReducers);

export type RootReducerType = typeof rootReducers;

// @ts-ignore
const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;

const middleware = [thunk];

export const store = createStore(reducer, composeEnhancers(applyMiddleware(...middleware)));
