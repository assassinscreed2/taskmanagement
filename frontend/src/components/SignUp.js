import { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Edit, LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
} from "@mui/material";

const defaultTheme = createTheme();

export default function SignUp() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("profileImage", selectedImage);

    const registerRequest = await fetch(
      `${process.env.REACT_APP_SERVER}/register`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (registerRequest.status === 400) {
      return;
    }

    const registerResponse = await registerRequest.json();
    // after registration
    navigate("/login");
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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={3} sx={{ textAlign: "center" }}>
                <input
                  accept="image/*"
                  id="profileImage"
                  type="file"
                  name="profileImage"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <label htmlFor="profileImage">
                  <Box
                    sx={{
                      position: "relative",
                      display: "inline-block",
                      "&:hover .edit-icon": {
                        visibility: "visible",
                      },
                    }}
                  >
                    <Avatar
                      src={selectedImage}
                      sx={{ width: 60, height: 60 }}
                    />
                    <IconButton
                      component="span"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0, 0, 0, 0.5)",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        visibility: "hidden",
                      }}
                      className="edit-icon"
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                </label>
              </Grid>
              <Grid item container xs={9} alignItems="center">
                <TextField
                  sx={{ marginTop: "0.5em" }}
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  name="firstname"
                  autoComplete="first-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login">Already have an account? Sign in</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
