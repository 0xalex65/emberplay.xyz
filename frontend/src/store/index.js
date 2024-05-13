import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";

import WalletReducer from "./reducers/Wallet";

const rootReducer = combineReducers({
  wallet: WalletReducer,
});

const middlewares = [thunk];
const devTools =
  typeof window !== "undefined" &&
  process.env.NODE_ENV !== "production" &&
  window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
      window.__REDUX_DEVTOOLS_EXTENSION__()
    : (a) => a;

const store = createStore(
  rootReducer,
  compose(applyMiddleware(...middlewares), devTools)
);

export default store;
