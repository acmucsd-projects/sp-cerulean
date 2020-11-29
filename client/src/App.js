import React from "react"
import Home from "./components/Home";
import CssBaseline from '@material-ui/core/CssBaseline';


const App = () => {
  return (
    <React.Fragment>
      <CssBaseline />
      <div>
        <Home />
      </div>
    </React.Fragment>
    
  );
};

export default App;
