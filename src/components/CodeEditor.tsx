import React from 'react';
import MonacoEditor from 'react-monaco-editor/lib/editor';

function CodeEditor({ code }: { code: string }) {
    const options = {
        selectOnLineNumbers: true,
        readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        lineNumbersMinChars: 10,
    };

    return (
        <MonacoEditor
            language="javascript"
            theme="vs-dark"
            value={code.replace(/```/g, '')}
            options={options}
        />
    );
}

export default CodeEditor;
