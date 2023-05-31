import React, { useState } from 'react';
import './App.css';
import { palette } from '@leafygreen-ui/palette';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputField from './components/InputField';
import { InputContext } from './components/InputContext';
import NavigationDrawer from './components/NavigationDrawer';
import Rive from '@rive-app/react-canvas';
import { QueryContext } from './components/QueryContext';

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

  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const addQuery = (query: string) => {
    setHistory(prevHistory => [...prevHistory, query]);
  };

  return (
    <div className="App">
      {/* <Shapes /> */}
      <header className='App-header' style={{ zIndex: 2, position: 'relative' }}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <ThemeProvider theme={theme}>
          <QueryContext.Provider value={{ history, addQuery }}>
            <InputContext.Provider value={{ input, setInput }}>
              <InputField />
              <NavigationDrawer />
            </InputContext.Provider>
          </QueryContext.Provider>
        </ThemeProvider>
      </header>
    </div >
  );
}

export default App;
