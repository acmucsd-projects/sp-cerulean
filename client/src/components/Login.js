import React, { useContext, setState, useState } from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./Header";
import { ReactComponent as Computers } from "./computers.svg";
import { UserContext } from "../UserContext";
import axios from "axios";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  img: {
    margin: "auto",
    display: "block",
    maxWidth: "90%",
    maxHeight: "90%",
  },
  item1: {
    order: 2,
    [theme.breakpoints.up("sm")]: {
      order: 1,
    },
  },
  item2: {
    order: 1,
    [theme.breakpoints.up("sm")]: {
      order: 2,
    },
  },
  textField: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

const Login = () => {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const [state, setState] = useState({
    username: "",
    password: "",
  });

  const login = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify({
      username: state.username,
      password: state.password,
    });

    const result = await axios
      .post("/api/authentication/login", body, config)
      .catch((err) => console.error(err));
    console.log(result.data);
    localStorage.setItem("token", result.data);
    setUser({ ...user, token: result.data });
  };

  if (user.token !== null) {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        style={{ height: "650px" }}
      >
        <Grid
          container
          item
          xs={12}
          sm={6}
          alignItems="center"
          direction="column"
          className={classes.item1}
        >
          <div />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h2" align="center">
              Welcome,
            </Typography>
            <Typography variant="h2" align="center">
              ACM Admin!
            </Typography>
            <Typography variant="body1">EMAIL</Typography>
            <TextField
              id="email"
              margin="dense"
              variant="outlined"
              className={classes.textField}
              onChange={(e) => setState({ ...state, username: e.target.value })}
            />
            <Typography variant="body1" style={{ padding: 0 }}>
              PASSWORD
            </Typography>
            <TextField
              id="password"
              margin="dense"
              type="password"
              variant="outlined"
              className={classes.textField}
              onChange={(e) => setState({ ...state, password: e.target.value })}
            />
            <Button
              onClick={login}
              variant="contained"
              color="secondary"
              size="large"
              maxWidth="180px"
            >
              LOGIN
            </Button>
          </div>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={6}
          direction="column"
          alignItems="center"
          className={classes.item2}
        >
          <div />
          <div>
            <Computers className={classes.img} />
          </div>
          <div />
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
