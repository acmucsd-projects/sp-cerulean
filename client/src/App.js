import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Footer from "./components/Footer";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";
import Header from "./components/Header";

const App = () => {
  const [user, setUser] = useState({
    token: null,
  });

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      checkToken();
    }
  }, []);

  const checkToken = async () => {
    const config = {
      headers: {
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    const result = await axios
      .get("/api/authentication/verify", config)
      .catch((err) => console.error(err));

    if (result === undefined) {
      localStorage.removeItem("token");
    } else {
      setUser({ ...user, token: localStorage.getItem("token") });
    }
  };
  return (
    <Router>
      <div>
        <React.Fragment>
          <CssBaseline />
          <div>
            <UserContext.Provider value={{ user, setUser }}>
              <Header />
              <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/home" component={Home} />
              </Switch>
            </UserContext.Provider>
          </div>
        </React.Fragment>
      </div>
    </Router>
  );
};

export default App;
