import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { dracula, draculaInit } from '@uiw/codemirror-theme-dracula';
import React, { useContext, useState } from "react";

interface CodeMirrorCustomProps {
    response: string;
}
const CodeMirrorCustom: React.FC<CodeMirrorCustomProps> = React.memo(({ response }) => {
    console.log("CodeMirrorCustom render, response:", response);

    return (
        <CodeMirror
            value={response}
            height="100%"
            readOnly={false}
            extensions={[javascript(), json()]}
            theme={dracula}
            style={{ paddingBottom: "20px" }}
        />
    );
});


export default CodeMirrorCustom;
