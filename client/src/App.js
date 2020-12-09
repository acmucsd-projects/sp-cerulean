import React from "react"
import Home from "./components/Home";
import CssBaseline from '@material-ui/core/CssBaseline';
import "./App.css";
import Login from "./components/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AverageChart from "./components/AverageChart";
import Home from "./components/Home";
import Header from "./components/Header";


const App = () => {
  return (
    <Router>
      <CssBaseline />
      <Header />
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/average" component={AverageChart} />
        <Route exact path="/home" component={Home} />
      </Switch>
    </Router>
  );
};

export default App;
