// index.js
import { legacy_createStore as createStore, combineReducers } from 'redux'
import { authReducer, loadAuthState, saveAuthState } from './authReducer'
import { apiReducer, loadApiState, saveApiState } from './apiReducer'
import { uiReducer } from './uiReducer'
import { paginationReducer, savePaginationState, loadPaginationState } from './paginationReducer'

// Carrega o estado inicial do auth e da API
const persistedAuthState = loadAuthState()
const persistedApiState = loadApiState()
const persistedPaginationState = loadPaginationState()

// Combina os reducers
const rootReducer = combineReducers({
  auth: authReducer,
  api: apiReducer,
  ui: uiReducer,
  pag: paginationReducer,
})

// Cria a store com o estado inicial do auth, API e UI
const store = createStore(rootReducer, {
  auth: persistedAuthState, // Usa o estado persistido para auth
  api: persistedApiState, // Usa o estado persistido para API
  pag: persistedPaginationState, // Usa o estado persistido para pagination
})

// Salva o estado no localStorage e sessionStorage sempre que houver uma mudança
store.subscribe(() => {
  const { auth, api, pag } = store.getState()

  if (!auth.isAuthenticated) {
    localStorage.removeItem('reduxAuthState')
    localStorage.removeItem('monitorId')
    sessionStorage.removeItem('reduxApiState')
    sessionStorage.removeItem('monitor')
    sessionStorage.removeItem('scheduled_backups')
    sessionStorage.removeItem('pagination')
  } else {
    saveAuthState(auth) // Salva o estado do auth
    saveApiState(api) // Salva o estado da API no sessionStorage
    savePaginationState(pag) // Salva a paginação no sessionStorage
  }
})

export { store }
