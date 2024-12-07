const initialState = {
  total_items: 1,
  page: 1,
  page_size: 1,
  total_pages: 1,
}

export const paginationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PAGINATION':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export const setPagination = (pagination) => ({
  type: 'SET_PAGINATION',
  payload: pagination,
})

export const savePaginationState = (authState) => {
  try {
    const serializedState = JSON.stringify(authState)
    sessionStorage.setItem('pagination', serializedState)
  } catch (e) {
    console.error('Failed to save pagination state:', e)
  }
}

export const loadPaginationState = () => {
  try {
    const serializedState = sessionStorage.getItem('pagination')
    return serializedState ? JSON.parse(serializedState) : undefined
  } catch (e) {
    console.error('Failed to load pagination state:', e)
    return undefined
  }
}
