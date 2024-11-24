import React from 'react'
import { Routes, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const PublicRoutes = ({ children }) => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  if (!isAuthenticated) {
    navigate('/login')
  }
  return !isAuthenticated ? <Routes>{children}</Routes> : null
}

export default PublicRoutes
