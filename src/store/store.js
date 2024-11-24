import { legacy_createStore as createStore, combineReducers } from 'redux'

// Recupera o estado inicial do localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState')
    return serializedState ? JSON.parse(serializedState) : undefined
  } catch (e) {
    console.error('Failed to load state:', e)
    return undefined
  }
}

// Salva o estado no localStorage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('reduxState', serializedState)
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

// Estado inicial do auth
const initialAuthState = {
  isAuthenticated: false,
  user: null,
}

// Actions
const LOGIN = 'LOGIN'
const LOGOUT = 'LOGOUT'

const login = (user) => ({
  type: LOGIN,
  payload: user,
})

const logout = () => ({
  type: LOGOUT,
})

// Auth reducer
const authReducer = (state = initialAuthState, action) => {
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

// Estado inicial da UI
const initialUIState = {
  sidebarShow: true,
  theme: 'light',
}

// UI reducer
const changeState = (state = initialUIState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  ui: changeState,
})

// Carrega o estado inicial do localStorage
const persistedState = loadState()

// Cria a store com o estado persistido
const store = createStore(rootReducer, persistedState)

// Salva o estado no localStorage sempre que ele mudar
store.subscribe(() => {
  const state = store.getState()

  // Verifica se o usuário fez logout
  if (!state.auth.isAuthenticated) {
    localStorage.removeItem('reduxState')
  } else {
    saveState(state)
  }
})

export { store, login, logout }
