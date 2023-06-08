import React, { useState } from 'react';
import { Paper, Box, Typography, IconButton, Modal, Button } from '@mui/material';
import { styled } from '@mui/system';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle, Cancel, FileCopy, Edit } from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { dracula, draculaInit } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';

interface CodeBlockProps {
    code: string;
}

const CodeBlockContainer = styled(Paper)(({ theme }) => ({
    borderRadius: '10px',
    fontSize: '0.85em',
    color: '#333',
    boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Courier New", Courier, monospace',
}));

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)({
    maxHeight: 'calc(100% - 80px)',
    overflow: 'auto',
});

const CodeBlockPrompt: React.FC<CodeBlockProps> = ({ code }) => {
    return (
        <CodeBlockContainer>
            <StyledSyntaxHighlighter language="javascript" style={oneDark}>
                {code}
            </StyledSyntaxHighlighter>
        </CodeBlockContainer>
    );
};

export default CodeBlockPrompt;
