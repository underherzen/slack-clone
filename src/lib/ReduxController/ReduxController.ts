import {RootReducerType} from "../../app/store/store";

enum ActionSubtypes {
  REQUEST = 'REQUEST',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  UPDATING = 'UPDATING',
  CLEAR = 'CLEAR'
}

type ReduxState = {
  value: any;
  isLoading: boolean;
  isLoaded: boolean;
  isFailed: boolean;
  error: any;
}

type TypesSequenceType = {
  [key: string]: string
}

type GetStateType = () => RootReducerType;

type TypeAny = any;

type DispatchType = (arg: { type: string, [key: string]: any }) => any;

type CreateActionType = {
  callApi: () => Promise<any>;
  afterSuccessCall?: (response: any, dispatch?: DispatchType, getState?: GetStateType) => any;
  afterFailCall?: (response: any, dispatch: DispatchType, getState: GetStateType) => any;
  payload?: any;
  actionGroupName: string;
}

type SliceType = string | null;

export class ReduxController {
  static createState = (value: any): ReduxState => ({
    value,
    isLoading: false,
    isLoaded: false,
    isFailed: false,
    error: null
  });

  static applyAction = <T extends { [key: string]: any }>(state: T, sliceName: SliceType, action: any, ...args: any) => {
    return !sliceName
      ? action(state, ...args)
      : {
        ...state,
        [sliceName]: action(state[sliceName], ...args),
      };
  };

  static createTypesSequence = (basename: string): TypesSequenceType => {
    return [
      ActionSubtypes.REQUEST,
      ActionSubtypes.SUCCESS,
      ActionSubtypes.FAILURE,
      ActionSubtypes.UPDATING,
      ActionSubtypes.CLEAR,
    ].reduce((object: TypesSequenceType, item: string) => {
      const type = `${basename}_${item}`;
      object[type] = type;
      return object;
    }, {});
  };

  static createReducer = (initialState: { [key: string]: ReduxState }, handlers: TypeAny) => {
    return function reducer(state = initialState, action: TypeAny) {
      if (Object.hasOwnProperty.call(handlers, action.type)) {
        return handlers[action.type](state, action);
      } else {
        return state;
      }
    };
  };

  static createHandlers = <T>(actionGroupName: string, sliceName: SliceType) => {
    return {
      [`${actionGroupName}_${ActionSubtypes.REQUEST}`](state: T) {
        return ReduxController.applyAction<T>(state, sliceName, ReduxController.request);
      },
      [`${actionGroupName}_${ActionSubtypes.SUCCESS}`](state: T, {payload, isReset = false}: { payload: any; isReset: boolean }) {
        return ReduxController.applyAction<T>(state, sliceName, ReduxController.success, payload, isReset);
      },
      [`${actionGroupName}_${ActionSubtypes.UPDATING}`](state: T, {payload}: { payload: any }) {
        return ReduxController.applyAction<T>(state, sliceName, ReduxController.request, payload, true);
      },
      [`${actionGroupName}_${ActionSubtypes.FAILURE}`](state: T, {error}: { error: any }) {
        return ReduxController.applyAction<T>(state, sliceName, ReduxController.failure, error);
      },
      [`${actionGroupName}_${ActionSubtypes.CLEAR}`](state: T, {payload}: { payload: any }) {
        return ReduxController.applyAction<T>(state, sliceName, ReduxController.clear, payload);
      },
    };
  };

  static applyValue = (value: any, newValue: any, isReset?: boolean) => {
    if (isReset) {
      return newValue;
    }

    if (Array.isArray(value) || Array.isArray(newValue)) {
      return [
        ...value,
        ...newValue,
      ];
    }

    if (typeof value === 'object' || typeof newValue === 'object') {
      return {
        ...value,
        ...newValue,
      };
    }

    return newValue;
  };

  static request = (model: ReduxState, payload: any, isUpdating = false) => {
    return {
      isLoaded: isUpdating ? model.isLoaded : false,
      isLoading: true,
      isFailed: false,
      error: null,
      value: !payload ? model.value : ReduxController.applyValue(model.value, payload),
    };
  };

  static success = (model: ReduxState, payload: any, isReset: boolean) => {
    return {
      ...model,
      value: ReduxController.applyValue(model.value, payload, isReset),
      isLoaded: true,
      isLoading: false,
    };
  };

  static failure = (model: ReduxState, error: any) => {
    return {
      ...model,
      isLoading: false,
      isFailed: true,
      error,
    };
  };

  static clear = (model: ReduxState, payload: any) => {
    return ReduxController.createState(payload);
  };

  static createAction = ({callApi, afterSuccessCall, afterFailCall, payload, actionGroupName}: CreateActionType) => (dispatch: DispatchType, getState: GetStateType) => {
    dispatch({type: `${actionGroupName}_${ActionSubtypes.REQUEST}`});
    return callApi()
      .then(response => {
        dispatch({type: `${actionGroupName}_${ActionSubtypes.SUCCESS}`, payload: response.data, ...payload});
        if (afterSuccessCall) {
          afterSuccessCall(response.data, dispatch, getState)
        }
      })
      .catch(error => {
        dispatch({type: `${actionGroupName}_${ActionSubtypes.FAILURE}`, error: error.response, ...payload});
        if (afterFailCall) {
          afterFailCall(error.response, dispatch, getState)
        }
      })
  }
}
