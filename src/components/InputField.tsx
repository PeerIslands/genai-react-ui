import React, { useContext, useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, ToggleButtonGroup, ToggleButton, Divider, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';
import PeerislandsLogo from '../images/peerislands.png';
import GoogleLogo from '../images/google.png';
import MongoDBLogo from '../images/mongodb.png';
import { QueryContext } from './QueryContext';
import { InputContext } from './InputContext';
import CodeEditor from "./CodeEditor";
import { Modal } from "@mui/material";
import CodeMirror from '@uiw/react-codemirror';
import { js as beautify } from 'js-beautify';

const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
}));

const ResultBox = styled(Box)(({ theme }) => ({
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '150px',
    paddingTop: theme.spacing(7),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '100%',
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
    position: 'absolute',
}));

const InputField: React.FC = () => {
    const [examples, setExamples] = useState("");
    const [test, setTest] = useState("");

    const { response, setResponse } = useContext(InputContext);
    const { prompt, setPrompt } = useContext(InputContext);

    const [temperature, setTemperature] = useState(0.3);
    const [maxOutputTokens, setMaxOutputTokens] = useState(512);
    const [model, setModel] = useState("code-bison");
    const [loading, setLoading] = useState(false);
    const [inputMode, setInputMode] = useState('freeform');
    const { addQuery } = useContext(QueryContext);
    const { input, setInput } = useContext(InputContext);
    const [open, setOpen] = useState(false);

    // Handle input mode change
    const handleModeChange = (event: React.MouseEvent<HTMLElement>, mode: string) => {
        setInputMode(mode);
    };

    const handleOpen = () => {
        setPrompt(beautify(prompt));
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const handleButtonClick = async () => {
        setLoading(true);
        setResponse("");
        addQuery(input);

        try {
            const response = await axios.post('http://localhost:8080/api/v1/predict',
                {
                    instances: [
                        {
                            prefix: input,
                            suffix: "",
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
                paddingTop: '150px',
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
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Input Natural Language Query"
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                        />
                    )}

                    {inputMode === "structured" && (
                        <>
                            <TextField
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Input Natural Language Query"
                                multiline
                                rows={4}
                                variant="outlined"
                                fullWidth
                            />
                            <TextField
                                value={examples}
                                onChange={(e) => setExamples(e.target.value)}
                                placeholder="Examples"
                                multiline
                                rows={2}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                            <TextField
                                value={test}
                                onChange={(e) => setTest(e.target.value)}
                                placeholder="Test"
                                multiline
                                rows={2}
                                variant="outlined"
                                fullWidth
                                margin="normal"
                            />
                        </>
                    )}

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

                    <Button variant="contained" onClick={handleOpen} sx={{ marginTop: '20px' }}>Show Prompt</Button>


                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box
                            sx={{
                                position: 'fixed',  // Make it fixed instead of absolute
                                top: '10%',  // 5% from the top
                                left: '10%',  // 5% from the left
                                width: '70%',  // 90% of the screen width
                                height: '70%',  // 90% of the screen height
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                                overflowY: 'scroll',  // Make it scrollable
                            }}
                        >
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Prompt
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" onClick={() => navigator.clipboard.writeText(prompt)} sx={{ marginBottom: '20px' }}>Copy Prompt</Button>
                            </Box>
                            <CodeMirror
                                value={prompt}
                            />
                        </Box>
                    </Modal>


                </StyledBox>
            </Box>
            <ResultBox>
                <StyledTextField
                    value={response}
                    InputProps={{
                        readOnly: true,
                    }}
                    placeholder="Returned result will be displayed here"
                    multiline
                    rows={10}
                    variant="outlined"
                />
                {loading && <StyledCircularProgress />}
            </ResultBox>
            {/* <ResultBox>
                <CodeEditor code={response} />
                {loading && <StyledCircularProgress />}
            </ResultBox> */}

            {/* <Footer /> */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: '40px',
                }}
            >
                <Typography variant="body2" style={{ paddingRight: '10px' }}>Tool built by</Typography>
                <img src={PeerislandsLogo} alt="peerislands_logo" style={{ width: '8%', paddingBottom: '10px' }} />
                <Typography variant="body2" style={{ paddingLeft: '10px', paddingRight: '10px' }}>Powered by</Typography>
                <img src={GoogleLogo} alt="google_logo" style={{ width: '8%', paddingRight: '10px' }} />and
                <img src={MongoDBLogo} alt="mongodb_logo" style={{ width: '12%', paddingLeft: '10px', paddingBottom: '8px' }} />
            </Box>
        </Box >
    );
};

export default InputField;