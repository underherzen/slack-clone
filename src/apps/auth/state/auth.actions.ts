import {ReduxController} from "../../../lib/ReduxController/ReduxController";
import {axios} from "../../../app/axios/axiosConfig";
import {AuthActionGroups} from "./auth.store";

export const login = () => ReduxController.createAction({
  callApi: () => axios.post('/auth/login', {}),
  actionGroupName: AuthActionGroups.user,
});
