import React from "react";
import Home from "./components/Home";
import CssBaseline from "@material-ui/core/CssBaseline";
import "./App.css";
import Login from "./components/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AverageChart from "./components/AverageChart";
import Header from "./components/Header";
import HeatMap from "./components/HeatMap";
import TestChart from "./components/TestChart";

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Header />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route
          exact
          path="/average"
          render={() => <AverageChart numberOfEvents={10} />}
        />
        <Route
          exact
          path="/heat"
          component={HeatMap}
        />
        <Route
          exact
          path="/test"
          component={TestChart}
        />
        <Route exact path="/home" component={Home} />
      </Switch>
    </Router>
  );
};

export default App;
