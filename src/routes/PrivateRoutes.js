import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const encodedUser = JSON.parse(localStorage.getItem('reduxAuthState'))
  const vms =
    useSelector((state) => state.api) || JSON.parse(sessionStorage.getItem('reduxApiState'))

  // Redireciona para /login se o usuário não estiver autenticado
  return isAuthenticated && encodedUser ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoutes
