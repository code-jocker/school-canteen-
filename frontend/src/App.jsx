import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Deposit from './pages/Deposit';
import Purchase from './pages/Purchase';
import Withdrawals from './pages/Withdrawals';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Classes from './pages/Classes';
import Chat from './pages/Chat';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main Layout with Sidebar
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Mobile sidebar overlay }
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
        </div>
      )}
      
      {/* Sidebar - fixed on mobile, static on desktop */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="md:hidden text-white p-4 flex items-center justify-between" style={{ backgroundColor: '#002B7F' }}>
          <span className="font-bold">Kageyo TSS</span>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-blue-800 rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin & Dean Routes */}
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'dean-admin']}>
                <MainLayout>
                  <Students />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/deposit"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'dean-admin']}>
                <MainLayout>
                  <Deposit />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/withdrawals"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'dean-admin']}>
                <MainLayout>
                  <Withdrawals />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Purchase - All roles can access */}
          <Route
            path="/purchase"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Purchase />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* All authenticated users can access */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Transactions />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Reports />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin & Dean Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'dean-admin']}>
                <MainLayout>
                  <Users />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/classes"
            element={
              <ProtectedRoute allowedRoles={['superadmin', 'dean-admin']}>
                <MainLayout>
                  <Classes />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Chat />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Settings />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
