// apiReducer.js

// Estado inicial da resposta /vms
const initialApiState = [
  {
    id: 0,
    vm_name: '',
    ip: '',
    ssh_user: '',
    has_postgre: false,
    pg_user: '',
    port: '',
  },
]

// Actions
const SET_API_DATA = 'SET_API_DATA'
const DELETE_API_DATA = 'DELETE_API_DATA'

// Action Creator
export const setApiData = (data) => ({
  type: SET_API_DATA,
  payload: data,
})

// API Reducer
export const apiReducer = (state = initialApiState, action) => {
  switch (action.type) {
    case SET_API_DATA:
      return action.payload
    default:
      return state
  }
}

// Funções para salvar e carregar o estado no sessionStorage
export const saveApiState = (apiState) => {
  try {
    const serializedState = JSON.stringify(apiState)
    sessionStorage.setItem('reduxApiState', serializedState)
  } catch (e) {
    console.error('Failed to save API state:', e)
  }
}

export const loadApiState = () => {
  try {
    const serializedState = sessionStorage.getItem('reduxApiState')
    return serializedState ? JSON.parse(serializedState) : undefined
  } catch (e) {
    console.error('Failed to load API state:', e)
    return undefined
  }
}
