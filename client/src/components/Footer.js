import { AppBar, Typography, Grid } from "@material-ui/core";

const Footer = () => {
  return (
    <AppBar position="static" color="primary">
      <Grid
      justify="space-between"
      container 
      >
        <Grid item>
          <Typography style={{ padding: 8 }}>
            <a style={{ padding: 8, color: '#FFF' }} href="https://github.com/acmucsd/sp-cerulean">We are open source!</a>
          </Typography>
        </Grid>
        <Grid item>
          <Typography style={{ padding: 8 }}>
          &copy; ACM Visualization 2021
          </Typography>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default Footer;
