import React, { useState } from 'react';
import { Paper, Box, Typography, IconButton, Modal, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle, Cancel, FileCopy, Edit, PlayArrow } from '@mui/icons-material';
import CodeMirror from '@uiw/react-codemirror';
import { dracula, draculaInit } from '@uiw/codemirror-theme-dracula';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import axios from 'axios';
import CodeBlockPrompt from './CodeBlockPrompt';

interface CodeBlockProps {
    code: string;
    validSyntax: boolean;
    validSemantics: boolean;
    handleCopyClick: () => void;
    setResponse: (newResponse: string) => void;
    selectedCollection: string;
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

const CodeBlock: React.FC<CodeBlockProps> = ({ code, validSyntax, validSemantics, handleCopyClick, setResponse, selectedCollection }) => {
    const [open, setOpen] = useState(false);
    const [editorCode, setEditorCode] = useState(code);
    const [resultOpen, setResultOpen] = useState(false);
    const [resultData, setResultData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setResponse(editorCode);
        setOpen(false);
    }

    const handlePlayClick = async () => {
        setLoading(true);
        const database = selectedCollection.split('.')[0];
        const payload = {
            command: code,
            db: database,
        };

        try {
            const response = await axios.post('http://0.0.0.0:8080/api/v1/run_mql', payload);
            console.log(response);
            setResultData(response.data);
            setResultOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseResult = () => {
        setResultOpen(false);
        setResultData(null);
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
                    <IconButton onClick={handlePlayClick} sx={{ color: 'inherit', marginLeft: '10px' }}>
                        {loading ? <CircularProgress size={24} /> : <PlayArrow />}
                    </IconButton>
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
            <Modal
                open={resultOpen}
                onClose={handleCloseResult}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    height: 600,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ color: 'gray' }}>
                        Execution Result
                    </Typography>
                    <Box sx={{
                        maxHeight: 'calc(100% - 56px)',  // 56px for the space taken by the title
                        overflowY: 'auto'
                    }}>
                        {(resultData !== null && resultData !== undefined) && <CodeBlockPrompt code={typeof resultData === 'string' ? resultData : typeof resultData === 'object' ? JSON.stringify(resultData, null, 2) : resultData.toString()} />}
                    </Box>
                </Box>

            </Modal>

        </CodeBlockContainer>
    );
};

export default CodeBlock;
