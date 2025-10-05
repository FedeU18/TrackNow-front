import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import './App.css'
import Home from "./Pages/Home/Home";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import Footer from "./components/Footer/Footer";
import SignIn from "./templates/sign-in/SignIn";
import SignUp from "./templates/sign-up/SignUp";
import ClienteDashboard from "./Pages/ClienteDashboard/ClienteDashboard";
import RepartidorDashboard from "./Pages/RepartidorDashboard/RepartidorDashboard";
import { ProtectedRoute } from "./components/ProtectedRoutes";

function AppContent() {
  const location = useLocation();
  const hideFooter = location.pathname.startsWith('/admin-dashboard');

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />

        {/*Dashboards protegidos*/}
        <Route
          path="/admin-dashboard/*"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente-dashboard/*"
          element={
            <ProtectedRoute roles={["cliente"]}>
              <ClienteDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/repartidor-dashboard/*"
          element={
            <ProtectedRoute roles={["repartidor"]}>
              <RepartidorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <AppContent />
      </div>
    </BrowserRouter>
  );
}

export default App;
