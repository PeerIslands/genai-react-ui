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
    validSyntax: boolean;
    setValidSyntax: (validSyntax: boolean) => void;
    validSemantics: boolean;
    setValidSemantics: (validSemantics: boolean) => void;
    collections: string[];
    setCollections: (collections: string[]) => void;
    selectedCollection: string;
    setSelectedCollection: (selectedCollection: string) => void;
    isAccessCollection: boolean;
    setIsAccessCollection: (isAccessCollection: boolean) => void;
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
    temperature: 0.1,
    setTemperature: () => { },
    validSyntax: false,
    setValidSyntax: () => { },
    validSemantics: false,
    setValidSemantics: () => { },
    collections: [],
    setCollections: () => { },
    selectedCollection: '',
    setSelectedCollection: () => { },
    isAccessCollection: false,
    setIsAccessCollection: () => { }
});
