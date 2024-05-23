import { useState } from "react";
import { LockOutlined } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Typography,
  Container,
  Grid,
  Backdrop,
  CircularProgress,
  Snackbar,
} from "@mui/material";

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();
  const errorMessage = {
    1: "Please enter both username and password",
    2: "Login Failed, Please enter valid credentials",
  };

  const [openErrorMessage, setOpenErrorMessage] = useState({
    open: false,
    errorMessage: 0,
  });

  const [loginLoading, setLoginLoading] = useState(false);

  const handleSnackbarClose = () => {
    setOpenErrorMessage(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoginLoading(true);
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    if (!username || !password) {
      setOpenErrorMessage({ open: true, errorMessage: 1 });
      setLoginLoading(false);
      return;
    }

    const userData = {
      username: username,
      password: password,
    };

    const loginRequest = await fetch(`${process.env.REACT_APP_SERVER}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!loginRequest.ok) {
      setLoginLoading(false);
      setOpenErrorMessage({ open: true, errorMessage: 2 });
      return;
    }

    const profileData = await loginRequest.json();

    navigate("/tasks", { state: profileData });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlined />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openErrorMessage.open}
        autoHideDuration={2000}
        onClose={handleSnackbarClose}
        message={errorMessage[openErrorMessage.errorMessage]}
        key={"bottom" + "center"}
      />
      <Backdrop open={loginLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}
