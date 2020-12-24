import { AppBar, Typography, Toolbar, Button } from "@material-ui/core";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";

const Header = () => {
  const { user, setUser } = useContext(UserContext);
  const logout = () => {
    localStorage.removeItem("token");
    setUser({ ...user, token: null });
  };
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Link to="/home" style={{ textDecoration: "none", color: "white" }}>
          <Typography variant="h1" style={{ padding: 5 }}>
            ACM Visualization
          </Typography>
        </Link>

        {user.token !== null && (
          <Button
            onClick={logout}
            variant="contained"
            color="secondary"
            size="large"
            maxWidth="180px"
          >
            LOGOUT
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
