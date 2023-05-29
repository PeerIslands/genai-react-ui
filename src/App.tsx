import React from 'react';
import './App.css';
import MongoLogin from './components/MongoLogin';
import { palette } from '@leafygreen-ui/palette';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputField from './components/InputField';

const theme = createTheme({
  palette: {
    primary: {
      main: palette.green.dark2,
    },
    secondary: {
      main: palette.gray.dark2,
    },
  },
});

function App() {
  return (
    <div className="App">
      <header className='App-header'>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <ThemeProvider theme={theme}>
          <MongoLogin />
          <InputField />
        </ThemeProvider>
      </header>
    </div >
  );
}

export default App;
