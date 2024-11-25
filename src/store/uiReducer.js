// uiReducer.js

// Estado inicial da UI
const initialUIState = {
  sidebarShow: true,
  theme: 'light',
}

// Action
const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR'

// Action Creator
export const toggleSidebar = () => ({
  type: TOGGLE_SIDEBAR,
})

// UI Reducer
export const uiReducer = (state = initialUIState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarShow: !state.sidebarShow,
      }
    default:
      return state
  }
}
