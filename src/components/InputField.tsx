import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import Typography from "@mui/material/Typography";
import { styled } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';


// Import the images
import GoogleLogo from '../images/google.png';
import MongoDBLogo from '../images/mongodb.png';


const InputField: React.FC = () => {
    // Google query related variables
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [temperature, setTemperature] = useState(0.3);
    const [maxOutputTokens, setMaxOutputTokens] = useState(512);
    const [task, setTask] = useState('GENERATION');
    const [model, setModel] = useState("code-bison");

    const [mode, setMode] = useState("freeform");
    const [question, setQuestion] = useState("");
    const [examples, setExamples] = useState("");
    const [test, setTest] = useState("");


    // Loading
    const [loading, setLoading] = useState(false);

    // MongoDB
    const [mongoUri, setMongoUri] = useState("");
    const [databases, setDatabases] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedCollection, setSelectedCollection] = useState("");


    const handleButtonClick = async () => {
        setLoading(true);

        try {
            const response = await axios.post('http://0.0.0.0:8080/api/v1/predict',
                {
                    instances: [
                        {
                            prefix: input,
                            suffix: "",
                        }
                    ],
                    parameters: {
                        task: "GENERATION",
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



    const connectToMongo = async () => {
        try {
            const res = await axios.post('/api/mongo/connect', { uri: mongoUri });
            setDatabases(res.data.databases);
            setCollections(res.data.collections);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDatabaseChange = (event: SelectChangeEvent) => {
        setSelectedDatabase(event.target.value as string);
    };

    const handleCollectionChange = (event: SelectChangeEvent) => {
        setSelectedCollection(event.target.value as string);
    };


    const TextGreen = styled('span')({
        color: 'forestgreen',
    });

    const TextBlue = styled('span')({
        color: '#4285F4',
        marginRight: '10px'
    });

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                gap: '20px',
                padding: '10px',
                height: '90vh'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: '50px',
                }}
            >
                <Typography variant="h2" component="h2" sx={{ marginTop: '100px', }}>
                    Query Builder
                </Typography>
                <br />
                <Typography variant="h5" component="h2">
                    Convert natural language to <TextGreen>MongoDB</TextGreen> queries with <TextBlue>Google AI</TextBlue>

                </Typography>
                <br />
                {/* <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        width: '70vw',
                        gap: '40px',
                        '& img': {
                            width: '15%',
                            transition: 'transform .2s', // Animation
                            '&:hover': {
                                transform: 'scale(1.2)',
                            },
                        },
                    }}
                >
                    <img src={GoogleLogo} alt="Google" />
                    <img src={MongoDBLogo} alt="MongoDB" style={{ width: "200px" }} />
                </Box> */}

            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '10px',
                }}
            >
                <Button variant={mode === 'freeform' ? "contained" : "outlined"} onClick={() => setMode('freeform')}>Free Form</Button>
                <Button variant={mode === 'structured' ? "contained" : "outlined"} onClick={() => setMode('structured')}>Structured</Button>
            </Box>

            {mode === 'freeform' ? (
                <TextField
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question to MongoDB"
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{ width: '70vw' }}
                />
            ) : (
                <>
                    <TextField
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Question"
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ width: '70vw' }}
                    />
                    <TextField
                        value={examples}
                        onChange={(e) => setExamples(e.target.value)}
                        placeholder="Examples"
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ width: '70vw' }}
                    />
                    <TextField
                        value={test}
                        onChange={(e) => setTest(e.target.value)}
                        placeholder="Test"
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ width: '70vw' }}
                    />
                </>
            )}


            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '10px',
                    marginBottom: '20px',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end', minWidth: '200px' }}>
                    <FormControl variant="outlined">
                        <InputLabel id="model-label">Model</InputLabel>
                        <Select
                            labelId="model-label"
                            label="Model"
                            value={model}
                            onChange={(e) => setModel(e.target.value as string)}
                        >
                            <MenuItem value={"code-bison"}>code-bison</MenuItem>
                            {/* Add other model options here */}
                        </Select>
                    </FormControl>

                    <TextField
                        id="temperature-label"
                        label="Temperature"
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        variant="outlined"
                    />

                    <TextField
                        id="max-tokens-label"
                        label="Max Output Tokens"
                        type="number"
                        value={maxOutputTokens}
                        onChange={(e) => setMaxOutputTokens(parseInt(e.target.value))}
                        variant="outlined"
                    />
                </Box>
            </Box>

            <TextField
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question to MongoDB"
                multiline
                rows={4}
                variant="outlined"
                sx={{ width: '70vw' }}
            />
            {loading ? (
                <CircularProgress />
            ) : (
                <Button variant="contained" onClick={handleButtonClick}>Ask</Button>
            )}
            <TextField
                value={response}
                InputProps={{
                    readOnly: true,
                }}
                placeholder="Returned query will be displayed here"
                multiline
                rows={4}
                variant="outlined"
                sx={{ width: '70vw' }}
            />
        </Box >
    );
};

export default InputField;
