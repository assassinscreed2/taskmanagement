import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProfileBar({ profile }) {
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("token", { path: "/" });
    handleUserMenuClose();
    navigate("/login");
  };

  const { avatar_url, firstname, username } = profile;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item container alignItems="center" sm>
              <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Task Management App
              </Typography>
            </Grid>
            <Grid item>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open Profile">
                  <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                    <Avatar alt={firstname} src={avatar_url} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={userMenuAnchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(userMenuAnchorEl)}
                  onClose={handleUserMenuClose}
                >
                  <MenuItem key="name">
                    <Typography textAlign="center">
                      Name: {firstname}
                    </Typography>
                  </MenuItem>
                  <MenuItem key="username">
                    <Typography textAlign="center">
                      Username: {username}
                    </Typography>
                  </MenuItem>
                  <MenuItem key="logout" onClick={handleLogout}>
                    <Button>Logout</Button>
                  </MenuItem>
                </Menu>
              </Box>
            </Grid>
          </Grid>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
