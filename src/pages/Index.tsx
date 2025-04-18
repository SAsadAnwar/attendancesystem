import { Navigate } from "react-router-dom";

// This page redirects to login
const Index = () => {
  return <Navigate to="/login" replace />;
};

export default Index;
