import { useState, useEffect } from 'react';
import {
  Switch, FormControlLabel, Box, Typography, Paper, TextField, Button, CssBaseline, ThemeProvider, createTheme, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Snackbar
} from '@mui/material';

// Blood types and their corresponding hex colors
const bloodTypes = [
  { type: 'A+', color: '#E69F00' },
  { type: 'A-', color: '#56B4E9' },
  { type: 'B+', color: '#009E73' },
  { type: 'B-', color: '#F0E442' },
  { type: 'AB+', color: '#0072B2' },
  { type: 'AB-', color: '#D55E00' },
  { type: 'O+', color: '#CC79A7' },
  { type: 'O-', color: '#999999' },
];

const enum_input = {
  blood: "selectedBloodTypes",
  user: "userData",
  dark: "ui_theme",
};

const compatibleBloodTypes = {
  'O-': 'O-',
  'O+': 'O+, O-',
  'A-': 'A-, O-',
  'A+': 'A+, A-, O+, O-',
  'B-': 'B-, O-',
  'B+': 'B+, B-, O+, O-',
  'AB-': 'AB-, A-, B-, O-',
  'AB+': 'AB+, AB-, A+, A-, B+, B-, O+, O-'
};

const BloodTypeToggle = () => {
  const [selectedBloodTypes, setSelectedBloodTypes] = useState({
    'A+': false, 'A-': false, 'B+': false, 'B-': false, 'AB+': false, 'AB-': false, 'O+': false, 'O-': false
  });
  const [loginData, setFormData] = useState({ username: '', password: '' });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const savedBloodTypes = JSON.parse(sessionStorage.getItem(enum_input.blood));
    if (savedBloodTypes) {
      setSelectedBloodTypes(savedBloodTypes);
    }

    const savedUserData = JSON.parse(sessionStorage.getItem(enum_input.user));
    if (savedUserData) {
      setFormData(savedUserData);
    }

    const savedDarkMode = JSON.parse(sessionStorage.getItem(enum_input.dark));
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode);
    }
  }, []);

  const handleBloodToggle = (bloodType) => {
    setSelectedBloodTypes((prevState) => {
      const updatedState = { ...prevState, [bloodType]: !prevState[bloodType] };
      sessionStorage.setItem(enum_input.blood, JSON.stringify(updatedState));
      return updatedState;
    });
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      const updatedState = { ...prevState, [name]: value };
      sessionStorage.setItem(enum_input.user, JSON.stringify(updatedState));
      return updatedState;
    });
  };

  const handleSubmit = async () => {
    loginData.user_pass = loginData.password;
    const dataToSend = {
      ...loginData,
      bloodTypes: selectedBloodTypes,
      tempo_atualizacao: Date.now()
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_ENDPOINT}?func=submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the appropriate headers
        },
        body: JSON.stringify(dataToSend), // Convert the data to a JSON string
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Parse the response JSON
      const responseData = await response.json();
      console.log(responseData);
      setToastMessage('envio com sucesso');
      setOpenToast(true);
      // alert("envio com sucesso");
    } catch (error) {
      if (error.message.includes('403')) {
        setToastMessage('Senha errada!');
        setOpenToast(true);
      }
      console.error('Error submitting data:', error);
    }
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
    },
  });

  // Function to get donors based on selected blood types
  const getDonorList = () => {
    return Object.entries(selectedBloodTypes).map(([bloodType, isLowOnReserve]) => {
      if (isLowOnReserve) {
        return (
          <Box key={bloodType} sx={{ marginTop: 2 }}>
            <Typography variant="h6" gutterBottom>
              Blood Type {bloodType} is low on reserve. Donors:
            </Typography>
            <Typography>
              {compatibleBloodTypes[bloodType]}
            </Typography>
          </Box>
        );
      }
      return null;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Blood Type Selector & Form
        </Typography>

        <Paper sx={{ padding: 2, marginBottom: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isDarkMode}
                onChange={() => {
                  setIsDarkMode((prev) => {
                    const newMode = !prev;
                    sessionStorage.setItem(enum_input.dark, JSON.stringify(newMode));
                    return newMode;
                  });
                }}
                color="primary"
              />
            }
            label="Dark Mode"
          />

          <Box sx={{ marginTop: 2 }}>
            <TextField
              label="Username"
              name="username"
              value={loginData.username}
              onChange={handleUserChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              name="password"
              value={loginData.password}
              onChange={handleUserChange}
              type="password"
              fullWidth
              variant="outlined"
              sx={{ marginTop: 2 }}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: 3 }}>
              Submit
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 3, marginTop: 3 }}>
            {bloodTypes.map(({ type, color }) => (
              <FormControlLabel
                key={type}
                control={
                  <Switch
                    checked={selectedBloodTypes[type]}
                    onChange={() => handleBloodToggle(type)}
                    color="primary"
                    sx={{
                      '& .MuiSwitch-thumb': { backgroundColor: color },
                      '& .MuiSwitch-track': { backgroundColor: color },
                    }}
                  />
                }
                label={type}
              />
            ))}
          </Box>
        </Paper>

        {getDonorList()}

        <Typography variant="h5" gutterBottom>
          Compatible Blood Types for Donation
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Recipient Blood Type</TableCell>
                <TableCell>Compatible Donor Blood Types</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(compatibleBloodTypes).map(([recipient, donors]) => (
                <TableRow key={recipient}>
                  <TableCell>{recipient}</TableCell>
                  <TableCell>{donors}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Box>

      {/* Snackbar Toast for 403 Error */}
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={() => setOpenToast(false)}
        message={toastMessage}
      />
    </ThemeProvider>
  );
};

export default BloodTypeToggle;
