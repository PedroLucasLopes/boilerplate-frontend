// index.js
import { legacy_createStore as createStore, combineReducers } from 'redux'
import { authReducer, loadAuthState, saveAuthState } from './authReducer'
import { apiReducer, loadApiState, saveApiState } from './apiReducer'
import { uiReducer } from './uiReducer'

// Carrega o estado inicial do auth e da API
const persistedAuthState = loadAuthState()
const persistedApiState = loadApiState()

// Combina os reducers
const rootReducer = combineReducers({
  auth: authReducer,
  api: apiReducer,
  ui: uiReducer,
})

// Cria a store com o estado inicial do auth, API e UI
const store = createStore(rootReducer, {
  auth: persistedAuthState, // Usa o estado persistido para auth
  api: persistedApiState, // Usa o estado persistido para API
})

// Salva o estado no localStorage e sessionStorage sempre que houver uma mudança
store.subscribe(() => {
  const { auth, api } = store.getState()

  if (!auth.isAuthenticated) {
    localStorage.removeItem('reduxAuthState')
    sessionStorage.removeItem('reduxApiState')
  } else {
    saveAuthState(auth) // Salva o estado do auth
  }

  saveApiState(api) // Salva o estado da API no sessionStorage
})

export { store }
