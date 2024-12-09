const getToken = () => {
  const tokenExists = JSON.parse(localStorage.getItem('reduxAuthState'))
  return tokenExists?.user || null
}

export default getToken
