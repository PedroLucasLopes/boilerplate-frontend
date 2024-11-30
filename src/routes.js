import React from 'react'

const Home = React.lazy(() => import('./views/home/Home'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/home', exact: true, name: 'Home', element: Home },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
]

export default routes
