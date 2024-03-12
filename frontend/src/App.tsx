import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import NotAuthRoutes from './components/NotAuthRoutes';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './layout/Layout';
import LandingPage from './pages/LandingPage';
import ProtectedRoutes from './components/ProtectedRoutes';
import UploadProductPage from './pages/UploadProducePage';
import DetailProductPage from './pages/DetailProductPage';
import CartPage from './pages/CartPage';
import HistoryPage from './pages/HistoryPage';
import TestPage from './pages/TestPage/TestPage';



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
            },
            {
              path: "test",
              element: <TestPage />
            }
          ]
        },
        // 로그인한 사용자만 접근 가능
        {
          element: <ProtectedRoutes />,
          children: [
            {
              path: "product/upload",
              element: <UploadProductPage />
            },
            {
              path: "product/:productId",
              element: <DetailProductPage />
            },
            {
              path: "user/cart",
              element: <CartPage />
            },
            {
              path: "history",
              element: <HistoryPage />
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
