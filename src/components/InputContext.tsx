import React from 'react';

interface IInputContext {
    input: string;
    setInput: (input: string) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    response: string;
    setResponse: (response: string) => void;
}

export const InputContext = React.createContext<IInputContext>({
    input: '',
    setInput: () => { },
    prompt: '',
    setPrompt: () => { },
    response: '',
    setResponse: () => { },
});
