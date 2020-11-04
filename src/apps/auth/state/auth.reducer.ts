import {ReduxController} from "../../../lib/ReduxController/ReduxController";
import {AuthSliceNames, AuthActionGroups} from "./auth.store";

const initialState = {
  [AuthSliceNames.user]: ReduxController.createState(null)
};

type InitialStateType = typeof initialState;

export default ReduxController.createReducer(initialState, {
  ...ReduxController.createHandlers<InitialStateType>(AuthActionGroups.user, AuthSliceNames.user),
})
