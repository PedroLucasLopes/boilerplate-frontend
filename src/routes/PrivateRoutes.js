import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  // Redireciona para /login se o usuário não estiver autenticado
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoutes
