import { SET_WALLET } from "../type";

export const setWallet = (data) => async (dispatch) => {
  dispatch({ type: SET_WALLET, payload: data });
};
