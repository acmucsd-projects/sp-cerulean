import { AppBar, Typography, Button, Grid } from "@material-ui/core";
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
      <Grid
      justify="space-between"
      container 
      >
        <Grid item>
          <Link to="/home" style={{ textDecoration: "none", color: "white" }}>
            <Typography variant="h2" style={{ padding: 5 }}>
              ACM Visualization
            </Typography>
          </Link>
        </Grid>
        <Grid item style={{ padding: 5 }}>
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
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Header;
