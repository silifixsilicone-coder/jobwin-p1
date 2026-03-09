import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import FindJob from './pages/FindJob';
import FindShop from './pages/FindShop';
import FindRepair from './pages/FindRepair';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EditListing from './pages/EditListing';
import FindWorkers from './pages/FindWorkers';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/find-job" element={<FindJob />} />
              <Route path="/find-shop" element={<FindShop />} />
              <Route path="/find-repair" element={<FindRepair />} />
              <Route path="/find-workers" element={<FindWorkers />} />
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/post-job" element={<Navigate to="/dashboard?tab=post_job" />} />
              <Route path="/list-shop" element={<Navigate to="/dashboard?tab=my_services" />} />
              <Route path="/repair-service" element={<Navigate to="/dashboard?tab=my_services" />} />
              <Route path="/edit/:type/:id" element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
