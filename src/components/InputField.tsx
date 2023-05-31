import React, { useState } from "react";
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, ToggleButtonGroup, ToggleButton, Divider, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { styled } from '@mui/system';

const StyledBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
}));

const InputField: React.FC = () => {
    const [input, setInput] = useState("");
    const [examples, setExamples] = useState("");
    const [test, setTest] = useState("");
    const [response, setResponse] = useState("");
    const [temperature, setTemperature] = useState(0.3);
    const [maxOutputTokens, setMaxOutputTokens] = useState(512);
    const [topK, setTopK] = useState(1);
    const [topP, setTopP] = useState(1);
    const [model, setModel] = useState("code-bison");
    const [loading, setLoading] = useState(false);
    const [inputMode, setInputMode] = useState('freeform');

    // Handle input mode change
    const handleModeChange = (event: React.MouseEvent<HTMLElement>, mode: string) => {
        setInputMode(mode);
    };
    const handleButtonClick = async () => {
        setLoading(true);

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
                        topK: topK,
                        topP: topP,
                        candidateCount: 1
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );

            const responseData = response.data;

            console.log(responseData);
            if (responseData && responseData.data) {
                setResponse(responseData.data);
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
                        <CircularProgress />
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

                    <TextField
                        id="top-k-label"
                        label="Top K"
                        type="number"
                        value={topK}
                        onChange={(e) => setTopK(parseInt(e.target.value))}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />

                    <TextField
                        id="top-p-label"
                        label="Top P"
                        type="number"
                        value={topP}
                        onChange={(e) => setTopP(parseFloat(e.target.value))}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                    />
                </StyledBox>
            </Box>
            <TextField
                value={response}
                InputProps={{
                    readOnly: true,
                }}
                placeholder="Returned result will be displayed here"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
            />
        </Box >
    );
};

export default InputField;