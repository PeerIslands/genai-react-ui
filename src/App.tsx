import React, { useState } from 'react';
import './App.css';
import { palette } from '@leafygreen-ui/palette';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import InputField from './components/InputField';
import { InputContext } from './components/InputContext';
import NavigationDrawer from './components/NavigationDrawer';
import { QueryContext } from './components/QueryContext';

const ipcRenderer = window.require('electron').ipcRenderer;

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

  const [input, setInput] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [context, setContext] = useState('');
  const [examples, setExamples] = useState('');
  const [temperature, setTemperature] = useState(0.1);
  const [history, setHistory] = useState<string[]>([]);
  const [validSyntax, setValidSyntax] = useState(false);
  const [validSemantics, setValidSemantics] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [isAccessCollection, setIsAccessCollection] = useState(false);

  const addQuery = (query: string) => {
    setHistory(prevHistory => [...prevHistory, query]);
  };

  return (
    <div className="App">
      <header className='App-header' style={{ zIndex: 2, position: 'relative' }}>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <ThemeProvider theme={theme}>
          <QueryContext.Provider value={{ history, addQuery }}>
            <InputContext.Provider value={{
              input,
              setInput,
              prompt,
              setPrompt,
              response,
              setResponse,
              context,
              setContext,
              examples,
              setExamples,
              temperature,
              setTemperature,
              validSyntax,
              setValidSyntax,
              validSemantics,
              setValidSemantics,
              collections,
              setCollections,
              selectedCollection,
              setSelectedCollection,
              isAccessCollection,
              setIsAccessCollection
            }}>
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
