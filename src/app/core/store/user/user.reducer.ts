import { Action, createReducer, on } from '@ngrx/store';
import { User } from '@spend-book/core/model/user';
import {
  loadUserFromLocalStorageSuccess,
  loginSuccess,
  logout,
  registerSuccess,
  registerTempUserSuccess,
  updateProfileSuccess
} from './user.actions';

export const userFeatureKey = 'user';

const defaultTempUser: Partial<User> = {
  username: '立即注册',
  registered: false
}

export interface State {
  user: Partial<User>;
  isAuthenticated: boolean;
}

export const initialState: State = {
  user: defaultTempUser,
  isAuthenticated: false
};

const reducer = createReducer(
  initialState,
  on(updateProfileSuccess, (state, { user }) => ({ ...state, user: { ...state.user, ...user }, isAuthenticated: true })),
  on(loginSuccess, registerSuccess, registerTempUserSuccess, (state, { user }) => ({
    ...state,
    user,
    isAuthenticated: true
  })),

  on(loadUserFromLocalStorageSuccess, (state, { user }) => {
    return {
      ...state,
      user,
      isAuthenticated: true
    }
  }),
  on(logout, (state, { id }) => ({ user: defaultTempUser, isAuthenticated: false }))
);

export function userReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}
