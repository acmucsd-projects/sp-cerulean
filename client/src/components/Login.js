import React, { useContext, useState } from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as Computers } from "./computers.svg";
import { UserContext } from "../UserContext";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  img: {
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
  },
}));

const Login = () => {
  const classes = useStyles();
  const { user, setUser } = useContext(UserContext);
  const [state, setState] = useState({
    username: "",
    password: "",
  });
  const [alertState, setAlert] = useState(false);

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
      .catch((err) => {
        console.error(err);
        setAlert(true);
        setTimeout(() => {
          setAlert(false);
        }, 5000);
      });

    if (result !== undefined) {
      localStorage.setItem("token", result.data);
      setUser({ ...user, token: result.data });
    }
  };

  if (user.token !== null) {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      {alertState && (
        <Alert
          severity="error"
          onClose={() => {
            setAlert(false);
          }}
          style={{
            width: "100%",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Username or Password is incorrect
        </Alert>
      )}
      <Grid
        container
        direction="row"
        justify="space-around"
        alignItems="center"
        style={{ marginTop: "12%", marginLeft: "10%" }}
      >
        <Grid
          item
          xs={12}
          sm={6}
          alignItems="center"
          className={classes.item1}
        >
          <div style={{ display: "flex", flexDirection: "column", width: "80%" }}>
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
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  login();
                }
              }}
              className={classes.textField}
              onChange={(e) => setState({ ...state, password: e.target.value })}
            />
            <Button
              onClick={login}
              variant="contained"
              color="secondary"
              size="large"
            >
              LOGIN
            </Button>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          alignItems="center"
          className={classes.item2}
        >
            <Computers className={classes.img} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
