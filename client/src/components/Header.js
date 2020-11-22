import { AppBar, Typography, Toolbar } from "@material-ui/core";
import React from "react"


const Header = () => {
    return (
    <AppBar position="static"
    color="primary">
        <Toolbar>
            <Typography variant='h1'
            style={{ padding: 10 }}>
                ACM Visualization
            </Typography>
        </Toolbar>
    </AppBar>
    );
};

export default Header;