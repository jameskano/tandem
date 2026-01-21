import { createBrowserRouter } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import Main from '../pages/Main'
import Dashboard from '../pages/Dashboard'
import Discover from '../pages/Discover'
import Planner from '../pages/Planner'
import Moments from '../pages/Moments'
import Settings from '../pages/Settings'
import Login from '../pages/Login'
import Register from '../pages/Register'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'discover',
        element: <Discover />,
      },
      {
        path: 'planner',
        element: <Planner />,
      },
      {
        path: 'moments',
        element: <Moments />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
])
