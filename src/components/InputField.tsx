import React, { useContext, useEffect, useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, ToggleButtonGroup, ToggleButton, Divider, Typography, CircularProgress, Switch, FormControlLabel } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';
import PeerislandsLogo from '../images/peerislands.png';
import GoogleLogo from '../images/google.png';
import MongoDBLogo from '../images/mongodb.svg';
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
import CodeBlock from "./CodeBlock";
import CodeBlockPrompt from "./CodeBlockPrompt";

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

function trimStartEachLine(text: string): string {
    if (text) {
        const lines = text.split('\n');
        const trimmedLines = lines.map(line => line.trimStart());
        const finalText = trimmedLines.join('\n');

        return finalText;
    } else {
        return '';
    }
}



const InputField: React.FC = () => {

    // Getting history from InputContext
    const { context, setContext } = useContext(InputContext);
    const { examples, setExamples } = useContext(InputContext);
    const { response, setResponse } = useContext(InputContext);
    const { prompt, setPrompt } = useContext(InputContext);
    const { input, setInput } = useContext(InputContext);
    const { validSyntax, setValidSyntax } = useContext(InputContext);
    const { validSemantics, setValidSemantics } = useContext(InputContext);

    const { temperature, setTemperature } = useContext(InputContext);
    const [maxOutputTokens, setMaxOutputTokens] = useState(512);
    const [model, setModel] = useState("code-bison");
    const [loading, setLoading] = useState(false);
    const [inputMode, setInputMode] = useState('freeform');
    const { addQuery } = useContext(QueryContext);

    const promptSections = prompt.split('############################################################');
    const instructions = trimStartEachLine(promptSections[0] ? promptSections[0].split('***** General Instructions Start ***** ')[1] : '').replace("***** General Instructions End *****", "");
    const question = trimStartEachLine(promptSections[1] ? promptSections[1].trim() : '');
    const schema = beautify(trimStartEachLine((promptSections[2] ? promptSections[2].trim() : '').replace("Schema model:", "")));
    const example = trimStartEachLine(promptSections[3] ? promptSections[3].trim() : '');

    const [open, setOpen] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openPromptSnackbar, setOpenPromptSnackbar] = useState(false);

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [isContextModalOpen, setIsContextModalOpen] = useState(false);
    const [isExampleModalOpen, setIsExampleModalOpen] = useState(false);
    const [isFullScreenEditor, setIsFullScreenEditor] = useState(false);
    const [isAutoDetect, setIsAutoDetect] = useState(true);

    const { collections, setCollections } = useContext(InputContext);
    const { selectedCollection, setSelectedCollection } = useContext(InputContext);
    const { isAccessCollection, setIsAccessCollection } = useContext(InputContext);

    const [openAccessModal, setOpenAccessModal] = useState(false);


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

    const loadCollections = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/collection_list');
            if (response.data == null) {
                console.log('response is null');
                return;
            }
            console.log(response)
            let collections = response.data.slice(1, -1).split(', ');
            setCollections(collections);
        } catch (error) {
            console.error('Failed to fetch collections', error);
        }
    };

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
        height: '100%',
        minHeight: inputMode == 'structured' ? '200px' : '250px',
        width: '100%',
        border: `0px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
    }));

    const toggleFullScreenEditor = () => {
        setIsFullScreenEditor(!isFullScreenEditor);
    };

    const toggleAutoDetect = () => {
        setIsAutoDetect(!isAutoDetect);
    };

    const handleModeChange = (event: React.MouseEvent<HTMLElement>, mode: string) => {
        if (mode == 'structured') {
            setIsAutoDetect(false);
        }
        else {
            setIsAutoDetect(true);
        }
        setContext('');
        setExamples('');
        setInputMode(mode);
    };

    const handleOpen = () => {
        setPrompt(prompt);
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

    const executeQuery = async () => {
        setLoading(true);
        setResponse("");
        addQuery(input);

        try {
            const response = await axios.post('http://0.0.0.0:8080/api/v1/predict',
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
                setValidSyntax(response.data.validSyntax);
                setValidSemantics(response.data.validSemantics);
            }
        } catch (error) {
            console.error('Error making request:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleButtonClick = () => {
        if (!isAccessCollection && isAutoDetect) {
            setOpenAccessModal(true);
        } else {
            executeQuery();
        }
    };

    const handleModalClose = () => {
        setOpenAccessModal(false);
    };

    const handleModalProceed = () => {
        setOpenAccessModal(false);
        executeQuery();
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

    useEffect(() => {
        loadCollections();
    }, []);


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
                <ToggleButton value="freeform" >
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
                            onChange={(e) => {
                                setInput(e.target.value);
                            }}
                            onBlur={(e) => {
                                if (isAutoDetect) {
                                    const words = e.target.value.split(/\s+/).filter(word => word.length > 0);
                                    let foundCollection = "Your collections";
                                    for (let i = 0; i < words.length; i++) {
                                        const wordMatch = collections.find(collection => (collection as string).toLowerCase().endsWith(words[i].toLowerCase()));
                                        if (wordMatch) {
                                            foundCollection = wordMatch as string;
                                            break;
                                        }
                                    }
                                    setIsAccessCollection(foundCollection == "Your collections" ? false : true);
                                    setSelectedCollection(foundCollection);
                                }
                            }}
                            value={input}
                            placeholder="Question"
                            multiline
                            rows={12}
                            variant="outlined"
                            fullWidth
                        />
                    )}

                    {inputMode === "structured" && (
                        <>
                            <TextField
                                onClick={isFullScreenEditor ? () => setIsQuestionModalOpen(true) : undefined}
                                onChange={(e) => { setInput(e.target.value) }}
                                value={input}
                                placeholder="Question"
                                multiline
                                rows={3}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                onClick={isFullScreenEditor ? () => handleOpenContextModal() : undefined}
                                onChange={(e) => setContext(e.target.value)}
                                value={context}
                                placeholder="Context/Schema"
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
                            <Typography variant="h6" component="h2" sx={{ position: 'absolute', top: '20px', left: '20px', color: 'gray' }}>
                                Enter your question
                            </Typography>
                            <IconButton onClick={() => setIsQuestionModalOpen(false)} sx={{ position: 'absolute', top: '5px', right: '5px', color: 'black', zIndex: 3 }}>
                                <Close />
                            </IconButton>
                            <CodeMirror
                                autoFocus={true}
                                height="70vh"
                                value={input}
                                onChange={(value) => setInput(value)}
                                extensions={[javascript(), json()]}
                                style={{ paddingTop: '40px' }}
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
                            <Typography variant="h6" component="h2" sx={{ position: 'absolute', top: '20px', left: '20px', color: 'gray' }}>
                                Enter your context/schema
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
                                            collections.map((collection: string, index: number) => (
                                                <MenuItem key={index} value={collection}>
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
                                height="60vh"
                                value={context}
                                onChange={(value) => setContext(value)}
                                extensions={[javascript(), json()]}
                                style={{ paddingTop: '40px' }}
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
                            <Typography variant="h6" component="h2" sx={{ position: 'absolute', top: '20px', left: '20px', color: 'gray' }}>
                                Enter your example
                            </Typography>
                            <IconButton onClick={() => setIsExampleModalOpen(false)} sx={{ position: 'absolute', top: '5px', right: '5px', color: 'black', zIndex: 3 }}>
                                <Close />
                            </IconButton>
                            <CodeMirror
                                autoFocus={true}
                                height="70vh"
                                value={examples}
                                onChange={(value) => setExamples(value)}
                                extensions={[javascript(), json()]}
                                style={{ paddingTop: '40px' }}
                                theme={dracula}
                            />
                        </Box>
                    </Modal>

                    {loading ? (
                        <Button disabled variant="contained" onClick={handleButtonClick} sx={{ marginTop: '20px' }} >Ask</Button>
                    ) : (
                        <Button variant="contained" onClick={handleButtonClick} sx={{ marginTop: '20px' }} >{loading ? 'Asking...' : 'Ask'}</Button>
                    )}

                    <Modal
                        open={openAccessModal}
                        onClose={handleModalClose}
                        aria-labelledby="access-modal-title"
                        aria-describedby="access-modal-description"
                    >
                        <Box
                            sx={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Typography id="access-modal-title" variant="h6" component="h2">
                                Warning!
                            </Typography>
                            <Typography id="access-modal-description" sx={{ mt: 2 }}>
                                The question is on a collection that you don't have access to. Do you want to proceed?
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mt: 2,
                                }}
                            >
                                <Button onClick={handleModalProceed}>Yes</Button>
                                <Button onClick={handleModalClose}>Cancel</Button>
                            </Box>
                        </Box>
                    </Modal>

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

                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <TextField
                            id="temperature-label"
                            label="Temperature"
                            type="number"
                            value={temperature}
                            InputProps={{
                                readOnly: true
                            }}
                            variant="outlined"
                            margin="normal"
                            sx={{ width: '48%' }}
                        />

                        <TextField
                            id="max-tokens-label"
                            label="Max Tokens"
                            type="number"
                            value={maxOutputTokens}
                            InputProps={{
                                readOnly: true
                            }}
                            variant="outlined"
                            margin="normal"
                            sx={{ width: '48%' }}
                        />
                    </Box>

                    <FormControl sx={{ width: '100%' }}>
                        {/* <InputLabel id="collection-label">Collections</InputLabel> */}
                        <Select
                            // labelId="collection-label"
                            // label="Collections"
                            displayEmpty={true}
                            renderValue={(value) => value === "" ? "Your collections" : value}
                            value={selectedCollection}
                            onChange={(e) => setSelectedCollection(e.target.value as string)}
                            fullWidth
                            inputProps={{ shrink: "true" }}
                            style={{ marginTop: '8px' }}
                        >
                            {collections.length > 0 ?
                                collections.map((collection) => (
                                    <MenuItem key={collection} value={collection}>
                                        {collection}
                                    </MenuItem>
                                )) :
                                <MenuItem value={""}>
                                    {"No collections available"}
                                </MenuItem>
                            }
                        </Select>
                    </FormControl>

                    <FormControlLabel
                        control={
                            <Switch
                                checked={isFullScreenEditor}
                                onChange={toggleFullScreenEditor}
                            />
                        }
                        label="Full screen editor"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isAutoDetect}
                                onChange={toggleAutoDetect}
                            />
                        }
                        label="Auto detect Collection"
                    />

                    <Button variant="contained" onClick={handleOpen} sx={{ marginTop: '37px' }}>Show Prompt</Button>

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
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h5" component="h2" sx={{ color: 'black' }}>
                                    Prompt
                                </Typography>
                                <IconButton onClick={handlePromptCopyClick}>
                                    <FileCopy />
                                </IconButton>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" component="h2" sx={{ marginTop: '20px', color: 'black' }}>
                                Instructions
                            </Typography>
                            <CodeBlockPrompt
                                code={instructions}
                            />

                            <Typography variant="h6" component="h2" sx={{ marginTop: '20px', color: 'black' }}>
                                Question
                            </Typography>
                            <CodeBlockPrompt
                                code={question}
                            />

                            <Typography variant="h6" component="h2" sx={{ marginTop: '20px', color: 'black' }}>
                                Schema
                            </Typography>
                            <CodeBlockPrompt
                                code={schema}
                            />

                            <Typography variant="h6" component="h2" sx={{ marginTop: '20px', color: 'black' }}>
                                Example
                            </Typography>
                            <CodeBlockPrompt
                                code={example}
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
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ flex: '1 1 auto', overflowY: 'auto', position: 'relative' }}>
                        <ResultBox>
                            {response ? (
                                <CodeBlock
                                    code={response}
                                    validSyntax={validSyntax}
                                    validSemantics={validSemantics}
                                    handleCopyClick={handleCopyClick}
                                    setResponse={setResponse}
                                    selectedCollection={selectedCollection}
                                />
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
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        marginTop: '0px',
                        backgroundColor: '#fff'
                    }}
                >
                    <Typography variant="body2" style={{ paddingRight: '10px' }}>Built by</Typography>
                    <img src={PeerislandsLogo} alt="peerislands_logo" style={{ width: '5%', paddingBottom: '5px' }} />
                    <Typography variant="body2" style={{ paddingLeft: '10px', paddingRight: '10px' }}>Powered by</Typography>
                    <img src={GoogleLogo} alt="google_logo" style={{ width: '5%', paddingRight: '10px', paddingTop: '3px' }} />
                    <span>and</span>
                    <img src={MongoDBLogo} alt="mongodb_logo" style={{ width: '8%', paddingLeft: '10px', paddingBottom: '0px' }} />
                </Box>


            </Box >

        </Box >
    );
};

export default InputField;