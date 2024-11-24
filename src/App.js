import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route } from 'react-router-dom'
import PublicRoutes from './routes/PublicRoutes'
import PrivateRoutes from './routes/PrivateRoutes'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

import './scss/examples.scss'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.ui.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, [])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <PublicRoutes>
          <Route exact path="/login" name="Login Page" element={<Login />} />
        </PublicRoutes>
        <PrivateRoutes>
          <Route path="*" name="Home" element={<DefaultLayout />} />
        </PrivateRoutes>
      </Suspense>
    </HashRouter>
  )
}

export default App
