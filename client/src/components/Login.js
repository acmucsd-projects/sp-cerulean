import React from "react";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as Computers } from "./computers.svg";

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
            <Typography variant="body">EMAIL</Typography>
            <TextField
              id="email"
              margin="dense"
              variant="outlined"
              className={classes.textField}
            />
            <Typography variant="body" style={{ padding: 0 }}>
              PASSWORD
            </Typography>
            <TextField
              id="email"
              margin="dense"
              variant="outlined"
              className={classes.textField}
            />
            <Button
              onClick={() => {
                alert("You've just started :)");
              }}
              variant="contained"
              color="secondary"
              size="large"
              maxWidth="180px"
            >
              START
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
