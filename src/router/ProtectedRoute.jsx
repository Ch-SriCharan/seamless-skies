import { Navigate } from 'react-router-dom';

/**
 * Toggle this flag to grant/revoke admin access.
 * In a real app this would come from an auth context / JWT.
 */
export const MOCK_IS_ADMIN = true;

/**
 * ProtectedRoute — wraps admin-only pages.
 * Redirects unauthenticated users to the home route.
 */
const ProtectedRoute = ({ children }) => {
  if (!MOCK_IS_ADMIN) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
