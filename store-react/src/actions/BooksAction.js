/*export const ADD_TO_CART = "ADD_TO_CART"
export const REMOVE_FROM_CART ='REMOVE_FROM_CART'
export const REMOVE_ALL_FROM_CART = "REMOVE_ALL_FROM_CART"*/
export const LOAD_CART_FROM_BACKEND = "LOAD_CART_FROM_BACKEND"
export const loadCartFromBackend = (cart) =>({
  type: LOAD_CART_FROM_BACKEND,
  cart,
})
export const LOAD_LIST_TO_STORE = "LOAD_LIST_TO_STORE"
export const loadListToStore = (booksData) =>({
  type: LOAD_LIST_TO_STORE,
  booksData,
})
/*
export const addToCart = (bookID) =>({
  type: ADD_TO_CART,
  bookID,
})
export const removeFromCart =(bookID) =>({
  type: REMOVE_FROM_CART,
  bookID,
})

export const Add_TO_LIST = "ADD_TO_LIST"
export const REMOVE_FROM_LIST = "REMOVE_FROM_LIST"
export const addToList = (bookData) =>({
  type: Add_TO_LIST,
  bookData,
})
*/
