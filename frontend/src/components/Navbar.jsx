import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import "./Navbar.css";
import "./profile_popup.css";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const popupRef = useRef(null);
  const { user, logout: authLogout } = useAuth();

  const toggleProfilePopup = () => setProfileOpen((prev) => !prev);

  const showAlert = (message, type = "info") => {
    const alertBox = document.createElement("div");
    alertBox.classList.add("custom-alert", `alert-${type}`, "show");
    alertBox.innerHTML = `${message} <span class="alert-close">&times;</span>`;
    document.body.appendChild(alertBox);

    alertBox.querySelector(".alert-close").addEventListener("click", () => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 400);
    });

    setTimeout(() => {
      alertBox.style.opacity = "0";
      setTimeout(() => alertBox.remove(), 400);
    }, 3000);
  };

  const handleLogout = async (event) => {
    event.stopPropagation();
    try {
      await authLogout(); // Ensure logout completes
      showAlert("Logout successful");
      setProfileOpen(false);
      navigate("/", { replace: true }); // Force redirect to root
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileOpen]);

  // Role-based navigation links
  const getNavLinks = () => {
    if (user?.role === "admin") {
      return (
        <>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/reports">Reports</Link>
          </li>
          <li>
            <Link to="/admin/validations">Validations</Link>
          </li>
          <li>
            <Link to="/admin/analytics">Analytics</Link>
          </li>
          <li>
            <Link to="/admin/settings">Console</Link>
          </li>
        </>
      );
    } else if (user?.role === "police") {
      return (
        <>
          <li>
            <Link to="/police/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/police/reports">All Reports</Link>
          </li>
          <li>
            <Link to="/police/pending">Pending Cases</Link>
          </li>
          <li>
            <Link to="/police/resolved">Resolved Cases</Link>
          </li>
          <li>
            <Link to="/police/analytics">Analytics</Link>
          </li>
          <li>
            <Link to="/police/settings">Console</Link>
          </li>
        </>
      );
    } else {
      // Public user or not logged in
      return (
        <>
          {!user && (
            <>
              <li>
                <Link to="/instructions">Instruction</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/report">Report</Link>
              </li>
              <li>
                <Link to="/notifications">Notifications</Link>
              </li>
              <li>
                <Link to="/alert">Alert</Link>
              </li>
              <li>
                <Link to="/public/settings">Account</Link>
              </li>
            </>
          )}
        </>
      );
    }
  };

  // Determine the home link based on role
  const getHomeLink = () => {
    if (user?.role === "admin") return "/admin/dashboard";
    if (user?.role === "police") return "/police/dashboard";
    if (user?.role === "public") return "/home";
    return "/instructions"; // Root route for public users
  };

  // Determine if we should show auth links or profile button
  const showAuthLinks = () => {
    if (user) {
      return (
        <button onClick={toggleProfilePopup} className="profile-btn">
          {user.name || "Guest"}
        </button>
      );
    } else {
      // Show both buttons on most pages
      if (location.pathname !== "/" && location.pathname !== "/start") {
        return (
          <div className="auth-buttons-container">
            <Link to="/" className="auth-btn">
              Sign In
            </Link>
            <Link to="/start" className="auth-btn sign-up-btn">
              Sign Up
            </Link>
          </div>
        );
      }
      // On login page, show only signup
      else if (location.pathname === "/") {
        return (
          <Link to="/start" className="auth-btn sign-up-btn">
            Sign Up
          </Link>
        );
      }
      // On signup page, show only signin
      else if (location.pathname === "/start") {
        return (
          <Link to="/" className="auth-btn">
            Sign In
          </Link>
        );
      }
    }
  };

  return (
    <header>
      <div className="navbar">
        <Link to={getHomeLink()}>
          <h1 className="logo">Stop Crime.</h1>
        </Link>

        <nav>
          <ul className="nav-links">{getNavLinks()}</ul>
        </nav>

        <div className="auth-links">{showAuthLinks()}</div>
      </div>

      {profileOpen && (
        <>
          <div className="overlay" onClick={() => setProfileOpen(false)}></div>
          <div className="profile-popup" ref={popupRef}>
            <div className="profile-header">
              <h2>{user?.name || "Guest"}</h2>
              <span className="rank">Gold</span>
            </div>
            <p>
              <strong>Username:</strong> {user?.name || "Guest"}
            </p>
            <p>
              <strong>Role:</strong> {user?.role || "Public"}
            </p>
            <p>
              <strong>Earned Points:</strong> 1200
            </p>
            {user && (
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
