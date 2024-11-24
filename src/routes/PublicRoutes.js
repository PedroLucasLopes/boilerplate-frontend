import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PublicRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  // Redireciona para /dashboard se o usuário estiver autenticado
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default PublicRoutes
