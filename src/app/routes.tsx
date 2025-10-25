import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { Layout } from './Layout'
import { Main } from '../pages/Main'
import { Dashboard } from '../pages/Dashboard'
import { Discover } from '../pages/Discover'
import { Planner } from '../pages/Planner'
import { Goals } from '../pages/Goals'
import { Moments } from '../pages/Moments'
import { Settings } from '../pages/Settings'

export const router = createBrowserRouter([
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
        path: 'goals',
        element: <Goals />,
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
