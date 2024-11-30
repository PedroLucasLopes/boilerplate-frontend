// Estado inicial da UI
const initialUIState = {
  sidebarShow: true, // Controla visibilidade
  sidebarUnfoldable: false, // Controla expansão
  theme: 'light',
}

// Actions
const TOGGLE_SIDEBAR_SHOW = 'TOGGLE_SIDEBAR_SHOW'
const TOGGLE_SIDEBAR_UNFOLDABLE = 'TOGGLE_SIDEBAR_UNFOLDABLE'

// Action Creators
export const toggleSidebarShow = () => ({
  type: TOGGLE_SIDEBAR_SHOW,
})

export const toggleSidebarUnfoldable = () => ({
  type: TOGGLE_SIDEBAR_UNFOLDABLE,
})

// Reducer
export const uiReducer = (state = initialUIState, action) => {
  switch (action.type) {
    case TOGGLE_SIDEBAR_SHOW:
      return {
        ...state,
        sidebarShow: !state.sidebarShow, // Alterna entre abrir/fechar
      }
    case TOGGLE_SIDEBAR_UNFOLDABLE:
      return {
        ...state,
        sidebarUnfoldable: !state.sidebarUnfoldable, // Alterna expansão/colapso
      }
    default:
      return state
  }
}
