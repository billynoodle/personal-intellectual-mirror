import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthGuard } from './features/auth/components/AuthGuard'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { Layout } from './components/Layout'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout>
                <Dashboard />
              </Layout>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  )
}
