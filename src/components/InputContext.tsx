import React from 'react';

interface IInputContext {
    input: string;
    setInput: (input: string) => void;
    prompt: string;
    setPrompt: (prompt: string) => void;
    response: string;
    setResponse: (response: string) => void;
    context: string;
    setContext: (context: string) => void;
    examples: string;
    setExamples: (examples: string) => void;
    temperature: number;
    setTemperature: (temperature: number) => void;
}

export const InputContext = React.createContext<IInputContext>({
    input: '',
    setInput: () => { },
    prompt: '',
    setPrompt: () => { },
    response: '',
    setResponse: () => { },
    context: '',
    setContext: () => { },
    examples: '',
    setExamples: () => { },
    temperature: 0.3,
    setTemperature: () => { },
});
