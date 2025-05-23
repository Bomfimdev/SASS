import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';

// Lazy loaded pages
const ProposalsPage = lazy(() => import('./pages/proposals/ProposalsPage'));
const NewProposalPage = lazy(() => import('./pages/proposals/NewProposalPage'));
const ProposalDetailPage = lazy(() => import('./pages/proposals/ProposalDetailPage'));
const CustomersPage = lazy(() => import('./pages/customers/CustomersPage'));
const NewCustomerPage = lazy(() => import('./pages/customers/NewCustomerPage'));
const CustomerDetailPage = lazy(() => import('./pages/customers/CustomerDetailPage'));
const TemplatesPage = lazy(() => import('./pages/templates/TemplatesPage'));
const TemplateDetailPage = lazy(() => import('./pages/templates/TemplateDetailPage'));
const AccountSettingsPage = lazy(() => import('./pages/account/AccountSettingsPage'));
const SubscriptionPage = lazy(() => import('./pages/account/SubscriptionPage'));

const LoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardPage />} />
              <Route path="propostas" element={<ProposalsPage />} />
              <Route path="propostas/nova" element={<NewProposalPage />} />
              <Route path="propostas/:id" element={<ProposalDetailPage />} />
              <Route path="clientes" element={<CustomersPage />} />
              <Route path="clientes/novo" element={<NewCustomerPage />} />
              <Route path="clientes/:id" element={<CustomerDetailPage />} />
              <Route path="modelos" element={<TemplatesPage />} />
              <Route path="modelos/:id" element={<TemplateDetailPage />} />
              <Route path="conta" element={<AccountSettingsPage />} />
              <Route path="assinatura" element={<SubscriptionPage />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;