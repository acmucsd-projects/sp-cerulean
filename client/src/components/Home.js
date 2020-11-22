import React from "react"
import Header from "./Header"
import { ReactComponent as Computers } from './computers.svg';
import { Grid, Paper } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"


const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '60%',
        maxHeight: '60%',
      },
  }));

const Home = () => {
    const classes = useStyles();

    return (
        <div>
            <Header />
            <Grid container spacing={3}
            direction="row"
            alignItems="center">
                <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>1</Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                <Paper className={classes.paper}>2</Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Computers className={classes.img}/>
                </Grid>
            </Grid>
        </div>

    );

};
export default Home;