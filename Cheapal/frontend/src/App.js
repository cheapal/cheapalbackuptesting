"use client"

import { useState } from "react"
import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./context/authContext"
import Navbar from "./components/Navbar"
import Home from "./pages/HomePage"
import CategoryPage from "./pages/CategoryPage"
import SubscriptionPage from "./pages/SubscriptionPage"
import SubscriptionDetail from "./components/subscriptions/SubscriptionDetail"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import SellerDashboard from "./pages/SellerDashboard"
import BuyerDashboard from "./pages/BuyerDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import AdminApprovalPage from "./pages/AdminApprovalPage"
import ProfilePage from "./pages/ProfilePage"
import SellerProfilePage from "./pages/SellerProfilePage"
import ChatPage from "./pages/ChatPage"
import ChatsListPage from "./pages/ChatsListPage"
import NotFoundPage from "./pages/NotFoundPage"
import CheckoutPage from "./pages/CheckoutPage"
import CartPage from "./pages/CartPage"
import OrderConfirmationPage from "./pages/OrderConfirmationPage"
import SearchResultsPage from "./pages/SearchResultsPage"
import LeaderboardPage from "./pages/LeaderboardPage"
import BlogPage from "./pages/BlogPage"

import "./App.css"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Protected Route Component with Enhanced Logging and Array Role Support
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log("[ProtectedRoute] Checking access for path:", location.pathname)
  console.log("[ProtectedRoute] Auth Loading:", loading)
  console.log("[ProtectedRoute] User:", user)
  console.log("[ProtectedRoute] Required Role(s):", requiredRole)

  if (loading) {
    console.log("[ProtectedRoute] Auth state is loading. Displaying loading message.")
    return (
      <div className="flex justify-center items-center min-h-screen text-white bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.warn("[ProtectedRoute] No user found. Redirecting to /login. Intended path:", location.pathname)
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole) {
    const hasRequiredRole = Array.isArray(requiredRole) ? requiredRole.includes(user.role) : user.role === requiredRole

    if (!hasRequiredRole) {
      console.warn(
        `[ProtectedRoute] Role mismatch. User role: '${user.role}', Required: '${JSON.stringify(requiredRole)}'. Redirecting to /.`,
      )
      return <Navigate to="/" replace />
    }
  }

  console.log("[ProtectedRoute] Access GRANTED to path:", location.pathname)
  return children
}

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode)

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        closeButton={false}
        toastClassName={() => "bg-transparent p-0 shadow-none mb-4"}
        bodyClassName={() => "p-0 m-0"}
        theme="dark"
      />
      <div className="flex flex-col overflow-hidden min-h-screen">
        <Navbar darkMode={darkMode} setDarkMode={toggleDarkMode} />
        <main className="flex-1 overflow-auto">
          <div className={`app-content-area relative z-0 w-full h-full`}>
            <Routes future={{ v7_relativeSplatPath: true }}>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/category/:categoryId" element={<CategoryPage />} />
              <Route path="/subscriptions/:id" element={<SubscriptionDetail />} />
              <Route path="/subscriptions" element={<SubscriptionPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/profile/:sellerId" element={<SellerProfilePage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/blogs" element={<BlogPage />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/seller-dashboard"
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SellerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/buyer-dashboard"
                element={
                  <ProtectedRoute requiredRole={["buyer", "user"]}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin/approvals"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminApprovalPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/checkout/:id"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/order-confirmation/:orderId"
                element={
                  <ProtectedRoute>
                    <OrderConfirmationPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chats"
                element={
                  <ProtectedRoute>
                    <ChatsListPage />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/chat/:chatId"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all routes */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
