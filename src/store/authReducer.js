// authReducer.js

// Estado inicial do auth
const initialAuthState = {
  isAuthenticated: false,
  user: null,
}

// Actions
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'

// Action Creators
export const login = (user) => ({
  type: LOGIN,
  payload: user,
})

export const logout = () => ({
  type: LOGOUT,
})

// Auth Reducer
export const authReducer = (state = initialAuthState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      }
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      }
    default:
      return state
  }
}

// Funções para salvar e carregar o estado no localStorage
export const loadAuthState = () => {
  try {
    const serializedState = localStorage.getItem('reduxAuthState')
    return serializedState ? JSON.parse(serializedState) : undefined
  } catch (e) {
    console.error('Failed to load auth state:', e)
    return undefined
  }
}

export const saveAuthState = (authState) => {
  try {
    const serializedState = JSON.stringify(authState)
    localStorage.setItem('reduxAuthState', serializedState)
  } catch (e) {
    console.error('Failed to save auth state:', e)
  }
}
