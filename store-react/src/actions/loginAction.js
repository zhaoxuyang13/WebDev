export const LOGIN_WITH_USER_INFO = "LOGIN_WITH_USER_INFO";
export const LOG_OUT = 'LOG_OUT'
export  const loginWithUserInfo = userData =>({
  type: LOGIN_WITH_USER_INFO,
  userData,
})
export const logOut = () => ({
  type: LOG_OUT
})