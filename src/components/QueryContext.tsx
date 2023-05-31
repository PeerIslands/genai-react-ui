import React from 'react';

interface IQueryContext {
    history: string[];
    addQuery: (query: string) => void;
}

export const QueryContext = React.createContext<IQueryContext>({
    history: [],
    addQuery: () => { }
});
