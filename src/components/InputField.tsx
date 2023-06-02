import React, { useContext, useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, ToggleButtonGroup, ToggleButton, Divider, Typography, CircularProgress, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';
import PeerislandsLogo from '../images/peerislands.png';
import GoogleLogo from '../images/google.png';
import MongoDBLogo from '../images/mongodb.png';
import { QueryContext } from './QueryContext';
import { InputContext } from './InputContext';
import { Modal } from "@mui/material";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { js as beautify } from 'js-beautify';
import { Snackbar, Alert, IconButton } from '@mui/material';
import FileCopy from '@mui/icons-material/FileCopy';
import Close from '@mui/icons-material/Close';

//THEMES
import { dracula, draculaInit } from '@uiw/codemirror-theme-dracula';

const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
}));

const StyledCodeMirror = styled(CodeMirror)(({ theme }) => ({
    height: '100%',
    '& .CodeMirror': {
        height: '100%'
    },
}));



const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '100%',
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
}));


const InputField: React.FC = () => {
    const { context, setContext } = useContext(InputContext);
    const { examples, setExamples } = useContext(InputContext);

    const { response, setResponse } = useContext(InputContext);
    const { prompt, setPrompt } = useContext(InputContext);

    const { temperature, setTemperature } = useContext(InputContext);
    const [maxOutputTokens, setMaxOutputTokens] = useState(512);
    const [model, setModel] = useState("code-bison");
    const [loading, setLoading] = useState(false);
    const [inputMode, setInputMode] = useState('freeform');
    const { addQuery } = useContext(QueryContext);
    const { input, setInput } = useContext(InputContext);
    const [open, setOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openPromptSnackbar, setOpenPromptSnackbar] = useState(false);

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [isContextModalOpen, setIsContextModalOpen] = useState(false);
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
    const [isFullScreenEditor, setIsFullScreenEditor] = useState(false);

    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');

    const handleOpenContextModal = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/collection_list');
            console.log(response.data);
            setCollections(response.data.map((item: any) => item.collection));
        } catch (error) {
            console.error('Failed to fetch collections', error);
        }
        setIsContextModalOpen(true);
    };

    const populateCollection = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/v1/schema?collection=${selectedCollection}`);
            console.log(response);
            // check if response is null
            if (response.data == null) {
                console.log('response is null');
                return;
            }
            setContext(context + '\n' + selectedCollection + ' schema' + '\n' + response.data.schema);
        } catch (error) {
            console.error('Failed to populate collection', error);
        }
    };



    const ResultBox = styled(Box)(({ theme }) => ({
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        height: '400px',
        minHeight: inputMode == 'structured' ? '200px' : '250px',
        width: '100%',
        border: `0px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
    }));

    const toggleFullScreenEditor = () => {
        setIsFullScreenEditor(!isFullScreenEditor);
    };

    const handleModeChange = (event: React.MouseEvent<HTMLElement>, mode: string) => {
        setInputMode(mode);
    };

    const handleOpen = () => {
        setPrompt(beautify(prompt));
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(response)
            .then(() => {
                setOpenSnackbar(true);
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handlePromptCopyClick = () => {
        navigator.clipboard.writeText(prompt)
            .then(() => {
                setOpenPromptSnackbar(true);
            })
            .catch(err => {
                console.log('Something went wrong', err);
            });
    };

    const handleClosePromptSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenPromptSnackbar(false);
    };

    const handleButtonClick = async () => {
        setLoading(true);
        setResponse("");
        addQuery(input);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/predict',
                {
                    instances: [
                        {
                            prefix: input.replace(/"/g, '\\"'),
                            suffix: "",
                            context: context.replace(/"/g, '\\"'),
                            examples: examples.replace(/"/g, '\\"'),
                        }
                    ],
                    parameters: {
                        temperature: temperature,
                        maxOutputTokens: maxOutputTokens,
                        candidateCount: 1
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log(response);
            if (response && response.data) {
                setResponse(response.data.code);
                setPrompt(response.data.prompt);
            }
        } catch (error) {
            console.error('Error making request:', error);
        } finally {
            setLoading(false);
        }
    };


    const TextMongoGreen = styled('span')({
        color: '#00684A',
    });

    const TextBlue = styled('span')({
        color: '#4285F4',
    });

    const TextRed = styled('span')({
        color: '#FF3E30',
    });

    const TextYellow = styled('span')({
        color: '#F7B529',
    });

    const TextGreen = styled('span')({
        color: '#179C52',
    });


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                padding: '10px',
                paddingTop: '60px',
                height: '80vh',
                '& > :not(style)': { width: '70vw' }
            }}
        >
            <Typography variant="h2" component="h2">
                Query Builder
            </Typography>
            <Typography variant="h5" component="h2">
                Convert natural language to <TextMongoGreen>MongoDB</TextMongoGreen> queries with
                <TextBlue> G</TextBlue>
                <TextRed>o</TextRed>
                <TextYellow>o</TextYellow>
                <TextBlue>g</TextBlue>
                <TextGreen>l</TextGreen>
                <TextRed>e</TextRed>
            </Typography>
            <ToggleButtonGroup
                value={inputMode}
                exclusive
                onChange={handleModeChange}
                sx={{ marginBottom: '20px' }}
            >
                <ToggleButton value="freeform">
                    Free form
                </ToggleButton>
                <ToggleButton value="structured">
                    Structured
                </ToggleButton>
            </ToggleButtonGroup>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'start',
                    justifyContent: 'space-between',
                    width: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        flexGrow: 1,
                        marginRight: '20px',
                    }}
                >
                    {inputMode === "freeform" && (
                        <TextField
                            onClick={isFullScreenEditor ? () => setIsQuestionModalOpen(true) : undefined}
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            placeholder="Question"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                        />
                    )}

                    {inputMode === "structured" && (
                        <>
                            <TextField
                                onClick={isFullScreenEditor ? () => setIsQuestionModalOpen(true) : undefined}
                                onChange={(e) => setInput(e.target.value)}
                                value={input}
                                placeholder="Question"
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                onClick={isFullScreenEditor ? () => handleOpenContextModal() : undefined}
                                onChange={(e) => setContext(e.target.value)}
                                value={context}
                                placeholder="Context"
                                multiline
                                rows={2}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                onClick={isFullScreenEditor ? () => setIsExampleModalOpen(true) : undefined}
                                onChange={(e) => setExamples(e.target.value)}
                                value={examples}
                                placeholder="Examples"
                                multiline
                                rows={2}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />

                        </>
                    )}

                    <Modal
                        open={isQuestionModalOpen}
                        onClose={() => setIsQuestionModalOpen(false)}
                    >
                        <Box sx={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            height: '80vh',
                            width: '80vw',
                            overflowY: 'scroll',
                        }}>
                            <Typography variant="h6" component="h2" sx={{ position: 'absolute', top: '10px', left: '10px', color: 'gray' }}>
                                Enter your question
                            </Typography>
                            <IconButton onClick={() => setIsQuestionModalOpen(false)} sx={{ position: 'absolute', top: '5px', right: '5px', color: 'black', zIndex: 3 }}>
                                <Close />
                            </IconButton>
                            <CodeMirror
                                autoFocus={true}
                                value={input}
                                onChange={(value) => setInput(value)}
                                extensions={[javascript(), json()]}
                                style={{ paddingTop: '20px' }}
                                theme={dracula}
                            />
                        </Box>
                    </Modal>

                    <Modal
                        open={isContextModalOpen}
                        onClose={() => setIsContextModalOpen(false)}
                    >
                        <Box sx={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            height: '80vh',
                            width: '80vw',
                            overflowY: 'scroll',
                        }}>
                            <Typography variant="h6" component="h2" sx={{ position: 'absolute', top: '10px', left: '10px', color: 'gray' }}>
                                Enter your context
                            </Typography>
                            <IconButton onClick={() => setIsContextModalOpen(false)} sx={{ position: 'absolute', top: '5px', right: '5px', color: 'black', zIndex: 3 }}>
                                <Close />
                            </IconButton>
                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '50px', alignItems: 'center' }}>
                                <FormControl sx={{ minWidth: '200px', marginRight: '20px' }}>
                                    <InputLabel id="collection-label">Collection</InputLabel>
                                    <Select
                                        defaultValue="select collection schema"
                                        labelId="collection-label"
                                        label="Collection"
                                        value={selectedCollection}
                                        onChange={(e) => setSelectedCollection(e.target.value as string)}
                                    >
                                        {collections.length === 0 ? (
                                            <MenuItem disabled value="select collection schema">
                                                No schema available
                                            </MenuItem>
                                        ) : (
                                            collections.map((collection: string) => (
                                                <MenuItem key={collection} value={collection}>
                                                    {collection}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>

                                </FormControl>
                                <Button variant="contained" onClick={populateCollection}>Populate</Button>
                            </Box>

                            <CodeMirror
                                autoFocus={true}
                                value={context}
                                onChange={(value) => setContext(value)}
                                extensions={[javascript(), json()]}
                                style={{ paddingTop: '20px' }}
                                theme={dracula}
                            />
                        </Box>
                    </Modal>


                    <Modal
                        open={isExampleModalOpen}
                        onClose={() => setIsExampleModalOpen(false)}
                    >
                        <Box sx={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            height: '80vh',
                            width: '80vw',
                            overflowY: 'scroll',
                        }}>
                            <Typography variant="h6" component="h2" sx={{ position: 'absolute', top: '10px', left: '10px', color: 'gray' }}>
                                Enter your example
                            </Typography>
                            <IconButton onClick={() => setIsExampleModalOpen(false)} sx={{ position: 'absolute', top: '5px', right: '5px', color: 'black', zIndex: 3 }}>
                                <Close />
                            </IconButton>
                            <CodeMirror
                                autoFocus={true}
                                value={examples}
                                onChange={(value) => setExamples(value)}
                                extensions={[javascript(), json()]}
                                style={{ paddingTop: '20px' }}
                                theme={dracula}
                            />
                        </Box>
                    </Modal>

                    {loading ? (
                        <Button disabled variant="contained" onClick={handleButtonClick} sx={{ marginTop: '20px' }} >Ask</Button>
                    ) : (
                        <Button variant="contained" onClick={handleButtonClick} sx={{ marginTop: '20px' }} >Ask</Button>
                    )}
                </Box>
                <StyledBox
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        width: '30%',
                    }}
                >
                    <FormControl>
                        <InputLabel id="model-label">Model</InputLabel>
                        <Select
                            labelId="model-label"
                            label="Model"
                            value={model}
                            onChange={(e) => setModel(e.target.value as string)}
                            fullWidth
                        >
                            <MenuItem value={"code-bison"}>code-bison</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        id="temperature-label"
                        label="Temperature"
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />

                    <TextField
                        id="max-tokens-label"
                        label="Max Tokens"
                        type="number"
                        value={maxOutputTokens}
                        onChange={(e) => setMaxOutputTokens(parseInt(e.target.value))}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isFullScreenEditor}
                                onChange={toggleFullScreenEditor}
                            />
                        }
                        label="Full screen editor"
                    />

                    <Button variant="contained" onClick={handleOpen} sx={{ marginTop: '20px' }}>Show Prompt</Button>


                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box
                            sx={{
                                position: 'fixed',
                                top: '10%',
                                left: '10%',
                                width: '70%',
                                height: '70%',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                overflowY: 'scroll',
                            }}
                        >
                            <Typography id="modal-modal-title" variant="h4" component="h2">
                                Prompt
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                {/* <Button variant="contained" onClick={() => navigator.clipboard.writeText(prompt)} sx={{ marginBottom: '20px' }}>Copy Prompt</Button> */}
                                <IconButton onClick={handlePromptCopyClick} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', color: 'black' }}>
                                    <FileCopy />
                                </IconButton>
                            </Box>
                            <CodeMirror
                                value={prompt}
                                readOnly={true}
                                extensions={[javascript(), json()]}
                                theme={dracula}
                            />
                            <Snackbar open={openPromptSnackbar} autoHideDuration={6000} onClose={handleClosePromptSnackbar}>
                                <Alert onClose={handleClosePromptSnackbar} severity="success" sx={{ width: '100%' }}>
                                    Prompt copied to clipboard!
                                </Alert>
                            </Snackbar>
                        </Box>
                    </Modal>


                </StyledBox>
            </Box>
            <ResultBox>
                <IconButton onClick={handleCopyClick} sx={{ position: 'absolute', top: '5px', right: '5px', color: '#00684A', zindex: 1 }}>
                    <FileCopy />
                </IconButton>
                {response ? (
                    <div>
                        <Typography variant="body1" style={{ textAlign: 'center', color: 'grey', paddingTop: '20px', paddingBottom: '20px' }}>
                            Results
                        </Typography>
                        <div style={{ maxHeight: 'calc(100% - 40px)', overflowY: 'auto' }}>
                            <CodeMirror
                                value={response}
                                height="100%"
                                readOnly={false}
                                extensions={[javascript(), json()]}
                                theme={dracula}
                                style={{ paddingBottom: '20px' }}
                            />
                        </div>
                    </div>
                ) : (
                    <Typography variant="body1" style={{ textAlign: 'center', color: 'grey', paddingTop: '20px' }}>
                        Response will be displayed here
                    </Typography>
                )}
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        Response copied to clipboard!
                    </Alert>
                </Snackbar>
                {loading && <StyledCircularProgress />}
            </ResultBox>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '40px',
                }}
            >
                <Typography variant="body2" style={{ paddingRight: '10px' }}>Built by</Typography>
                <img src={PeerislandsLogo} alt="peerislands_logo" style={{ width: '8%', paddingBottom: '10px' }} />
                <Typography variant="body2" style={{ paddingLeft: '10px', paddingRight: '10px' }}>Powered by</Typography>
                <img src={GoogleLogo} alt="google_logo" style={{ width: '8%', paddingRight: '10px' }} />and
                <img src={MongoDBLogo} alt="mongodb_logo" style={{ width: '12%', paddingLeft: '10px', paddingBottom: '8px' }} />
            </Box>
        </Box >
    );
};

export default InputField;