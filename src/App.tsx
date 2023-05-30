import React from 'react';
import './App.css';
import MongoLogin from './components/MongoLogin';
import { palette } from '@leafygreen-ui/palette';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputField from './components/InputField';
import NavigationDrawer from './components/NavigationDrawer';
import Rive from '@rive-app/react-canvas';

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

const Shapes = () => (
  <Rive src="Assets/shapes.riv" style={{ position: "absolute", width: "100%", height: "100%", zIndex: 0 }} />
);

function App() {
  return (
    <div className="App">
      {/* <Shapes /> */}
      <header className='App-header' style={{ zIndex: 2, position: 'relative' }}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <ThemeProvider theme={theme}>
          <NavigationDrawer />
          <MongoLogin />
          <InputField />
        </ThemeProvider>
      </header>
    </div >
  );
}

export default App;
