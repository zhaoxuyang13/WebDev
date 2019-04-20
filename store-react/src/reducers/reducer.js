import { LOG_OUT,  LOGIN_WITH_USER_INFO} from '../actions/loginAction'
import {
  LOAD_LIST_TO_STORE,
  LOAD_CART_FROM_BACKEND
} from '../actions/BooksAction'
import {SIGN_UP} from '../actions/SignUpAction'
/* currently using local predefined initial value
* if createStore provided init state, this init will not take effect
* */
export const initialState = {
  userInfo: {
    isLogin: false,
    isAdmin: false,
    userID: null,
    email: null
  },
  userCart:[],
  books:[]
}

function LoginReducer (state = initialState.userInfo, action) {
  switch(action.type) {
    case LOGIN_WITH_USER_INFO:
    case SIGN_UP:
      const adminFlag = action.userData.userAuth === "admin";
      return Object.assign({}, state, {
          isLogin: true,
          userID: action.userData.userID,
          username:action.userData.username,
          email: action.userData.email,
          isAdmin: adminFlag
        })
    case LOG_OUT:
      return Object.assign({}, state, {
          isLogin: false,
          userID: null,
          isAdmin: false,
          email:null
      })
    default:
      return state
  }
}

function cartReducer (state = initialState.userCart, action) {
  switch (action.type) {
    case LOAD_CART_FROM_BACKEND:
      return action.cart;
    case LOG_OUT:
      return [];
    default:
      return state;
  }
}

function ListReducer (state = initialState.books, action){
  switch (action.type) {
    case LOAD_LIST_TO_STORE:
      return action.booksData
    default:
      return state;
  }
}
export function storeApp(state = initialState, action) {
  return {
    userInfo: LoginReducer(state.userInfo, action),
    userCart: cartReducer(state.userCart, action),
    books: ListReducer(state.books, action),
  }
}

