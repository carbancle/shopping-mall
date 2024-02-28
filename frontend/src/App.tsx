import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import NotAuthRoutes from './components/NotAuthRoutes';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './layout/Layout';
import LandingPage from './pages/LandingPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import ProtectedPage from './pages/ProtectedPage';



function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout />
      ),
      children: [
        {
          path: "",
          element: <LandingPage />
        },
        // 로그인하지 않은 사용자만 접근 가능
        {
          element: <NotAuthRoutes />,
          children: [
            {
              path: "login",
              element: <LoginPage />
            },
            {
              path: "register",
              element: <RegisterPage />
            }
          ]
        },
        // 로그인한 사용자만 접근 가능
        {
          element: <ProtectedRoutes />,
          children: [
            {
              path: "protected",
              element: <ProtectedPage />
            },
          ]
        },
      ]
    },
  ]);
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
