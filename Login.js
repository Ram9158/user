import React, { useState } from "react";
import {
  Button,
  TextField,
  Snackbar,
  Alert,
  Paper,
  Stack,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialState = {
  username: "",
  password: "",
};

const Login = () => {
  const [inputData, setInputData] = useState(initialState);
  const [errorOpen, setErrorOpen] = useState(false);
  const navigate = useNavigate();

  const handleOnChange = (event, name) => {
    const value = event.target.value;
    setInputData({ ...inputData, [name]: value });
  };

  const login = async () => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/auth/login",
        inputData
      );
      if (response.status === 200) {
        localStorage.setItem("token", response?.data?.token);
        localStorage.setItem("name", response?.data?.firstName);
        navigate("/home");
      }
    } catch (err) {
      setErrorOpen(true);
      console.error("Login failed:", err);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Stack spacing={2}>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            size="small"
            fullWidth
            value={inputData.username}
            onChange={(event) => handleOnChange(event, "username")}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            size="small"
            type="password"
            fullWidth
            value={inputData.password}
            onChange={(event) => handleOnChange(event, "password")}
          />
          <Button variant="contained" fullWidth onClick={login}>
            Login
          </Button>
        </Stack>
      </Paper>

      <Snackbar
        open={errorOpen}
        autoHideDuration={4000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setErrorOpen(false)} sx={{ width: "100%" }}>
          Invalid username or password.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
