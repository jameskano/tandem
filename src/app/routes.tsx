import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Main from '../pages/Main';
import Dashboard from '../pages/Dashboard';
import Discover from '../pages/Discover';
import Planner from '../pages/Planner';
import Moments from '../pages/Moments';
import Settings from '../pages/Settings';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import ErrorPage from '../pages/ErrorPage';
import NotFound from '../pages/NotFound';
import {
  ProtectedRoute,
  PublicRoute,
} from '../components/ProtectedRoute/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'discover',
        element: (
          <ProtectedRoute>
            <Discover />
          </ProtectedRoute>
        ),
      },
      {
        path: 'planner',
        element: (
          <ProtectedRoute>
            <Planner />
          </ProtectedRoute>
        ),
      },
      {
        path: 'moments',
        element: (
          <ProtectedRoute>
            <Moments />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
