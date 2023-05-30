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


// Import the images
import GoogleLogo from '../images/google.png';
import MongoDBLogo from '../images/mongodb.png';


const InputField: React.FC = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");
    const [temperature, setTemperature] = useState(0.3);
    const [maxOutputTokens, setMaxOutputTokens] = useState(512);
    const [task, setTask] = useState('GENERATION');
    const [model, setModel] = useState("code-bison");
    const [uri, setUri] = useState("");
    const [dbInfo, setDbInfo] = useState({ database: "", collection: "" });

    const [mongoUri, setMongoUri] = useState("");
    const [databases, setDatabases] = useState([]);
    const [collections, setCollections] = useState([]);
    const [selectedDatabase, setSelectedDatabase] = useState("");
    const [selectedCollection, setSelectedCollection] = useState("");


    const handleButtonClick = async () => {
        console.log(input);
        const response = await new Promise((resolve) =>
            setTimeout(() => resolve("Response from the server"), 1000)
        );
        setResponse(response as string);
    };

    const handleConnect = async () => {
        try {
            const response = await axios.post('/api/connect', { uri });
            setDbInfo(response.data);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
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
                    justifyContent: 'space-between',
                    width: '70vw',
                    gap: '20px',
                    marginBottom: '20px',
                }}
            >
                <TextField
                    value={mongoUri}
                    onChange={(e) => setMongoUri(e.target.value)}
                    placeholder="MongoDB URI"
                    variant="outlined"
                    sx={{ flexGrow: 1 }}
                />
                <Button variant="contained" onClick={connectToMongo}>Connect</Button>
            </Box>

            <div style={{ display: 'flex', justifyContent: 'space-between', width: '70vw', marginBottom: '20px' }}>
                <FormControl variant="outlined" style={{ width: '48%' }}>
                    <InputLabel id="database-label">Database</InputLabel>
                    <Select
                        labelId="database-label"
                        value={selectedDatabase}
                        onChange={handleDatabaseChange}
                        label="Database"
                    >
                        {databases.map((db) => (
                            <MenuItem key={db} value={db}>
                                {db}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ width: '48%' }}>
                    <InputLabel id="collection-label">Collection</InputLabel>
                    <Select
                        labelId="collection-label"
                        value={selectedCollection}
                        onChange={handleCollectionChange}
                        label="Collection"
                    >
                        {collections.map((col) => (
                            <MenuItem key={col} value={col}>
                                {col}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '70vw',
                    gap: '20px',
                    marginBottom: '20px',
                }}
            >
                <FormControl sx={{ flexGrow: 1 }}>
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

                <FormControl sx={{ flexGrow: 1 }}>
                    <InputLabel id="temperature-label">Temperature</InputLabel>
                    <Select
                        labelId="temperature-label"
                        label="Temperature"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value as number)}
                    >
                        <MenuItem value={0.1}>0.1</MenuItem>
                        <MenuItem value={0.3}>0.3</MenuItem>
                        <MenuItem value={0.5}>0.5</MenuItem>
                        {/* ... other values ... */}
                    </Select>
                </FormControl>

                <FormControl sx={{ flexGrow: 1 }}>
                    <InputLabel id="max-tokens-label">Max Output Tokens</InputLabel>
                    <Select
                        labelId="max-tokens-label"
                        label="Max-tokens"
                        value={maxOutputTokens}
                        onChange={(e) => setMaxOutputTokens(e.target.value as number)}
                    >
                        <MenuItem value={256}>256</MenuItem>
                        <MenuItem value={512}>512</MenuItem>
                        <MenuItem value={1024}>1024</MenuItem>
                        {/* ... other values ... */}
                    </Select>
                </FormControl>

                <FormControl sx={{ flexGrow: 1 }}>
                    <InputLabel id="task-label">Task</InputLabel>
                    <Select
                        labelId="task-label"
                        label="task"
                        value={task}
                        onChange={(e) => setTask(e.target.value as string)}
                    >
                        <MenuItem value={'GENERATION'}>Generation</MenuItem>
                        {/* ... other values ... */}
                    </Select>
                </FormControl>
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
            <Button variant="contained" onClick={handleButtonClick}>Ask</Button>
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
