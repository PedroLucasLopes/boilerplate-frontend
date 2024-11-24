import React from 'react'
import { Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const PrivateRoutes = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <Routes>{children}</Routes> : null
}

export default PrivateRoutes
