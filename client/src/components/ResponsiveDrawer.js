import React, { useContext, useEffect, useState } from 'react';

import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import AccountCircle from '@material-ui/icons/AccountCircle';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import DashboardIcon from '@material-ui/icons/Dashboard';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import ListAltIcon from '@material-ui/icons/ListAlt';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';

import { Link } from 'react-router-dom';

import Foods from '../pages/Foods';
import UserTable from '../components/UserTable';
import { AuthContext } from '../context/auth';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function ResponsiveDrawer(props) {
  const { user, signout } = useContext(AuthContext);
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const path = window.location.pathname.split('/');
  const currentPath = path[1];

  const [navTitle, setNavTitle] = useState(currentPath.capitalize());

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  function handleSelectedNav(text) {
    if (text === navTitle.toLowerCase()) return true;
  }

  function handleMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleSignout() {
    setAnchorEl(null);
    signout();
  }

  const mainContent = (
    <>
      {navTitle === 'Dashboard' ? <h1>dashboard</h1> : ''}

      {navTitle === 'Foods' ? <Foods /> : ''}

      {navTitle === 'Orders' ? <h1>orders</h1> : ''}

      {navTitle === 'Users' ? <UserTable /> : ''}
    </>
  );

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List disablePadding={true}>
        <ListItem
          button
          key="Dashboard"
          component={Link}
          to={`/dashboard`}
          selected={handleSelectedNav('dashboard')}
          onClick={() => setNavTitle('Dashboard')}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={'Dashboard'} />
        </ListItem>
        <ListItem
          button
          key="Foods"
          component={Link}
          to={`/foods`}
          selected={handleSelectedNav('foods')}
          onClick={() => setNavTitle('Foods')}
        >
          <ListItemIcon>
            <FastfoodIcon />
          </ListItemIcon>
          <ListItemText primary={'Foods'} />
        </ListItem>
        <ListItem
          button
          key="Orders"
          component={Link}
          to={`/orders`}
          selected={handleSelectedNav('orders')}
          onClick={() => setNavTitle('Orders')}
        >
          <ListItemIcon>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary={'Orders'} />
        </ListItem>
        <ListItem
          button
          key="Users"
          component={Link}
          to={`/users`}
          selected={handleSelectedNav('users')}
          onClick={() => setNavTitle('Users')}
        >
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText primary={'Users'} />
        </ListItem>
      </List>
    </div>
  );

  const profileMenu = (
    <div style={{ marginLeft: 'auto' }}>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleSignout}>Logout</MenuItem>
      </Menu>
    </div>
  );

  return (
    <>
      {user && user.role === 'Admin' && (
        <div className={classes.root}>
          <CssBaseline />
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h5" noWrap>
                {navTitle}
              </Typography>
              {profileMenu}
            </Toolbar>
          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Hidden smUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen}
                onClose={handleDrawerToggle}
                classes={{
                  paper: classes.drawerPaper
                }}
                ModalProps={{
                  keepMounted: true // Better open performance on mobile.
                }}
              >
                {drawer}
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper
                }}
                variant="permanent"
                open
              >
                {drawer}
              </Drawer>
            </Hidden>
          </nav>
          <main className={classes.content}>
            <div className={classes.toolbar} />
            {mainContent}
          </main>
        </div>
      )}
    </>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(typeof Element === 'undefined' ? Object : Element)
};

export default ResponsiveDrawer;
