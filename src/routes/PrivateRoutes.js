import React, { useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useGetVms from '../hooks/useGetVms'

const PrivateRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const encodedUser = JSON.parse(sessionStorage.getItem('user'))
  const { getVms } = useGetVms()

  useEffect(() => {
    if (isAuthenticated && encodedUser) {
      getVms(encodedUser)
    }
  }, [isAuthenticated, encodedUser, getVms])

  // Redireciona para /login se o usuário não estiver autenticado
  return isAuthenticated && encodedUser ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoutes
