import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import styles from "./AdminDashboard.module.css";
import CrudDashboard2 from "../../templates/crud-dashboard2/CrudDashboard";

import PedidosList from "../../templates/crud-dashboard2/components/PedidosList";
import PedidosShow from "../../templates/crud-dashboard2/components/PedidosShow";
import PedidosCreate from "../../templates/crud-dashboard2/components/PedidosCreate";
import PedidosEdit from "../../templates/crud-dashboard2/components/PedidosEdit";

import UsuariosList from "../../templates/crud-dashboard2/components/UsuariosList";
import UsuariosShow from "../../templates/crud-dashboard2/components/UsuariosShow";
import UsuariosCreate from "../../templates/crud-dashboard2/components/UsuariosCreate";
import UsuariosEdit from "../../templates/crud-dashboard2/components/UsuariosEdit";

export default function AdminDashboard() {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<CrudDashboard2 />}>
          <Route index element={<Navigate to="pedidos" replace />} />
          
          {/* Rutas de Pedidos */}
          <Route path="pedidos" element={<PedidosList />} />
          <Route path="pedidos/:pedidoId" element={<PedidosShow />} />
          <Route path="pedidos/new" element={<PedidosCreate />} />
          <Route path="pedidos/:pedidoId/edit" element={<PedidosEdit />} />
          
          {/* Rutas de Usuarios */}
          <Route path="usuarios" element={<UsuariosList />} />
          <Route path="usuarios/:usuarioId" element={<UsuariosShow />} />
          <Route path="usuarios/new" element={<UsuariosCreate />} />
          <Route path="usuarios/:usuarioId/edit" element={<UsuariosEdit />} />
        </Route>
      </Routes>
    </div>
  );
}
