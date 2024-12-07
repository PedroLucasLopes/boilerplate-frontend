const tokenExists = JSON.parse(localStorage.getItem('reduxAuthState'))
const token = tokenExists && tokenExists.user

export default token
