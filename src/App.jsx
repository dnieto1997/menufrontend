import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';

import { LoaderProvider, useLoader } from './context/PreloadContext';
import { Preload } from './components/Preload';

export const App = () => {

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  const ProtectedRouteLg = ({ children }) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      return <Navigate to="/home/dashboard" replace />;
    }
    return children;
  }

  const LoaderWrapper = () => {
    const { isLoading } = useLoader();
    return isLoading ? <Preload /> : null;
  };

  return (
    <LoaderProvider>
      <LoaderWrapper />
        <Router>
          <Routes>
            <Route path="/login" element={<ProtectedRouteLg><Login /></ProtectedRouteLg>} />
            <Route 
              path="/home/*" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>

    </LoaderProvider>
  );

}
