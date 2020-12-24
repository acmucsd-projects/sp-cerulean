import React, {useState, useMemo} from "react"
import Home from "./components/Home";
import Login from "./components/Login";
import CssBaseline from '@material-ui/core/CssBaseline';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import { UserContext } from "./UserContext";
import AverageChart from "./components/AverageChart";

const App = () => {
    const [user, setUser] = useState(null);
    const value = useMemo(() => ({user, setUser}), [user, setUser]);
    return (
      <Router>
        <div>
          <React.Fragment>
            <CssBaseline />
            <div>
              <UserContext.Provider value={value}>
                <Switch>
                  <Route exact path="/" component={Login} />
                  <Route
                    exact
                    path="/average"
                    render={() => <AverageChart numberOfEvents={10} />}
                  />
                  <Route path="/home" component={Home} />
                </Switch>
              </UserContext.Provider>
            </div>
          </React.Fragment>
        </div>
      </Router>
    );
}

export default App;
