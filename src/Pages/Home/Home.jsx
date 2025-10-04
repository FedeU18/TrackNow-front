import React from "react";
import "./Home.css";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function Home() {

    return (
        <div className="home-container">
            {/* Title */}
            <h1 className="title">
                Track Now
            </h1>
            <p className="home-subtitle">
                Tu solución de seguimiento de paquetes
            </p>

            {/* Buttons */}
            <div className="home-buttons">
                <Link to="/register" className="btn btn-register">
                    Register
                </Link>
                <Link to="/login" className="btn btn-login">
                    Login
                </Link>
            </div>
        </div>
    );


}
