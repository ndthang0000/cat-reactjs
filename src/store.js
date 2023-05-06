import { createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  isAuthenticate: false,
  userInformation: {},
  isShowBackdrop: false
}

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    case 'login':
      return { ...state, isAuthenticate: true, userInformation: rest.userInformation }
    case 'logout':
      return { ...state, isAuthenticate: false, userInformation: {} }
    case 'set-backdrop':
      return { ...state, isShowBackdrop: !state.isShowBackdrop }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store
