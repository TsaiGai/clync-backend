import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Assuming token is stored on login

  // If the token exists, render the children (protected component)
  // Otherwise, redirect to the /auth page
  return token ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
