import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css'
import Home from "./Pages/Home/Home";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import Footer from "./components/Footer/Footer";
import SignIn from "./templates/sign-in/SignIn";
import SignUp from "./templates/sign-up/SignUp";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
