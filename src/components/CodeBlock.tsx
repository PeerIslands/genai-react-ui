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
    validSyntax: boolean;
    validSemantics: boolean;
    handleCopyClick: () => void;
    setResponse: (newResponse: string) => void;
}

const CodeBlockContainer = styled(Paper)(({ theme }) => ({
    borderRadius: '10px',
    fontSize: '0.85em',
    color: '#333',
    boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)',
    fontFamily: '"Courier New", Courier, monospace',
    overflow: 'hidden',
}));

const CodeBlockHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2f3542',
    color: '#d8dee9',
    borderRadius: '10px 10px 0 0',
    padding: theme.spacing(1),
    marginTop: theme.spacing(2),
}));

const SyntaxValidation = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2),
}));

const StyledSyntaxHighlighter = styled(SyntaxHighlighter)({
    maxHeight: 'calc(100% - 80px)',
    overflow: 'auto',
});

const CodeBlock: React.FC<CodeBlockProps> = ({ code, validSyntax, validSemantics, handleCopyClick, setResponse }) => {
    const [open, setOpen] = useState(false);
    const [editorCode, setEditorCode] = useState(code);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setResponse(editorCode);
        setOpen(false);
    }

    return (
        <CodeBlockContainer>
            <CodeBlockHeader>
                <Box sx={{ display: 'flex' }}>
                    <SyntaxValidation>
                        {validSyntax ? <CheckCircle style={{ color: "green" }} /> : <Cancel style={{ color: "red" }} />}
                        <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                            Syntax Validated
                        </Typography>
                    </SyntaxValidation>
                    <SyntaxValidation>
                        {validSemantics ? <CheckCircle style={{ color: "green" }} /> : <Cancel style={{ color: "red" }} />}
                        <Typography variant="body1" sx={{ marginLeft: "10px" }}>
                            Semantics Validated
                        </Typography>
                    </SyntaxValidation>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
                    <IconButton onClick={handleOpen} sx={{ color: 'inherit', marginLeft: '10px' }}>
                        <Edit />
                    </IconButton>
                    <IconButton onClick={handleCopyClick} sx={{ color: 'inherit' }}>
                        <FileCopy />
                    </IconButton>
                </Box>
            </CodeBlockHeader>
            <StyledSyntaxHighlighter language="javascript" style={oneDark}>
                {code}
            </StyledSyntaxHighlighter>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ position: 'absolute', top: '20px', left: '20px', color: 'gray' }}>
                        Edit Code
                    </Typography>
                    <CodeMirror
                        autoFocus={true}
                        onChange={(value) => setEditorCode(value)}
                        height="60vh"
                        value={editorCode}
                        extensions={[javascript(), json()]}
                        style={{ paddingTop: '40px' }}
                        theme={dracula}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                        <Button variant="contained" onClick={handleClose} sx={{ width: '100px' }}>Done</Button>
                    </Box>
                </Box>
            </Modal>
        </CodeBlockContainer>
    );
};

export default CodeBlock;
