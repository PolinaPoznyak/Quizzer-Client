import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import "../Navbar.css"

export const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authUserId");
    navigate("/login");
  };

  const handleLogoutConfirmed = () => {
    closeLogoutDialog();
    logout();
  };

  return (
    <nav>
      <Link to="/adminpanel" className="title">
        Quizzer Admin Panel
      </Link>
      <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
        <NavLink onClick={openLogoutDialog}>Logout</NavLink>
        </li>
      </ul>

      <Dialog open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Logout Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeLogoutDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirmed} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </nav>
  );
};

export default AdminNavbar;
