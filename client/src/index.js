import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#3C4858",
    },
  },
  typography: {
    h1: {
      fontFamily: "Nunito",
      fontSize: "64px",
    },
    h2: {
      fontFamily: "Nunito",
      fontSize: "36px",
    },
  },
});

ReactDOM.render(
  <Fragment>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Fragment>,
  document.getElementById("root")
);
