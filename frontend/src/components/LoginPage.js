import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";

const LoginPage = ({ setAuthentication }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        { username, password },
        { withCredentials: true }
      );
      if (response.data.login) {
        sessionStorage.setItem("token", response.data.token);
        setAuthentication(true);
      }
    } catch (error) {
      alert(error.response.data.message);
      console.error("Login failed:", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Grid container marginTop={10} spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" textTransform="uppercase" textAlign="center">
            admin login
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            type="text"
            label="Username"
            variant="outlined"
            onBlur={(e) => setUsername(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            size="small"
            type="password"
            label="Password"
            variant="outlined"
            onBlur={(e) => setPassword(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            onClick={handleLogin}
          >
            Login
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
