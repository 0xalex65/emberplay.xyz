import { SET_WALLET } from "../type.js";

const initialState = {};

const WalletReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_WALLET:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default WalletReducer;
