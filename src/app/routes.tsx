import { createBrowserRouter, Outlet } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Main from '../pages/Main';
import Discover from '../pages/Discover';
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
import SavedActivities from '../pages/SavedActivities';

export const router = createBrowserRouter([
  {
    element: <Outlet />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: 'reset-password',
        element: (
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        ),
      },
    ],
  },

  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <Main />
          </PublicRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <Discover />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: 'discover',
      //   element: (
      //     <ProtectedRoute>
      //       <Discover />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: 'saved-activities',
        element: (
          <ProtectedRoute>
            <SavedActivities />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: 'planner',
      //   element: (
      //     <ProtectedRoute>
      //       <Planner />
      //     </ProtectedRoute>
      //   ),
      // },
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
