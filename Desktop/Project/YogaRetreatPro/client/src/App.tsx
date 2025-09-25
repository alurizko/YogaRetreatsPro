import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomePage from '@/pages/HomePage'
import SearchPage from '@/pages/SearchPage'
import RetreatsPage from '@/pages/RetreatsPage'
import RetreatDetailPage from '@/pages/RetreatDetailPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import AddRetreatPage from '@/pages/AddRetreatPage'
import WishlistPage from '@/pages/WishlistPage'
import AboutPage from '@/pages/AboutPage'
import ConfirmEmailPage from '@/pages/ConfirmEmailPage'
import ProtectedRoute from '@/components/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import '@/i18n'

const queryClient = new QueryClient()

// Layout component
function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </div>
  )
}

// Router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchPage /> },
      { path: "retreats", element: <RetreatsPage /> },
      { path: "retreat/:id", element: <RetreatDetailPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "confirm-email", element: <ConfirmEmailPage /> },
      { path: "add-retreat", element: <AddRetreatPage /> },
      { path: "wishlist", element: <WishlistPage /> },
      {
        path: "dashboard",
        element: <ProtectedRoute />,
        children: [
          // Dashboard specific routes can go here
        ],
      },
      { path: "about", element: <AboutPage /> },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <RouterProvider 
            router={router}
            future={{
              v7_startTransition: true,
            }}
          />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App