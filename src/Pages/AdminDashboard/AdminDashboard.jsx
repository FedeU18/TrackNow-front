import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import CrudDashboard from "../../templates/crud-dashboard/CrudDashboard";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Reemplazar con el estado real de autenticación y usuario
  const user = { nombre: "Admin" }; // Ejemplo de usuario autenticado

  const handleLogout = () => {
    // Implementar lógica de logout
    // logout();        //limpia el token
    navigate("/"); //redirige al home
  };

  return (
    <div className={styles.container}>
      <CrudDashboard />
    </div>
  );
}
