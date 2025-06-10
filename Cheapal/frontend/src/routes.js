import { createBrowserRouter } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home';
import CategoryLanding from './pages/Categories/CategoryLanding';
import CategoryPage from './pages/Categories/[category]';
import SubscriptionDetailPage from './pages/Categories/[category]/[id]';
import NotFound from './pages/NotFound';
import MainLayout from './components/Layout/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: React.createElement(MainLayout),
    children: [
      {
        index: true,
        element: React.createElement(Home)
      },
      {
        path: 'categories',
        children: [
          {
            index: true,
            element: React.createElement(CategoryLanding)
          },
          {
            path: ':category',
            children: [
              {
                index: true,
                element: React.createElement(CategoryPage)
              },
              {
                path: ':id',
                element: React.createElement(SubscriptionDetailPage)
              }
            ]
          }
        ]
      },
      {
        path: 'login',
        element: React.createElement(LoginPage)
      },
      {
        path: 'register',
        element: React.createElement(RegisterPage)
      },
      {
        path: '*',
        element: React.createElement(NotFound)
      }
    ]
  }
]);

export default router;
