import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export const ProtectedRoute = ({ children, roles }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  //mapa de roles a dashboards
  const roleRedirects = {
    cliente: "/cliente-dashboard",
    repartidor: "/repartidor-dashboard",
    admin: "/admin-dashboard",
  };

  //si no hay token => redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  //si hay roles definidos y el usuario no pertenece => redirigir a su dashboard
  const userRole = user?.rol?.toLowerCase();
  if (roles && !roles.includes(userRole)) {
    const redirect = roleRedirects[userRole] || "/";
    return <Navigate to={redirect} replace />;
  }

  return children;
};