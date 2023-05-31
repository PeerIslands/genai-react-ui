import React from 'react';

interface IInputContext {
    input: string;
    setInput: (input: string) => void;
}

export const InputContext = React.createContext<IInputContext>({
    input: '',
    setInput: () => { }
});
