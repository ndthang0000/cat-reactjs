import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  isAuthenticate: false
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'login':
      return { ...state, isAuthenticate: true }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
