import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

// Import the images
import GoogleLogo from '../images/google.png';  // adjust the path as per your project structure
import MongoDBLogo from '../images/mongodb.png';  // adjust the path as per your project structure
import Dropdowns from "./Dropdowns";

const InputField: React.FC = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleButtonClick = async () => {
        console.log(input);
        const response = await new Promise((resolve) =>
            setTimeout(() => resolve("Response from the server"), 1000)
        );
        setResponse(response as string);
    };

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
                    width: '70vw',
                    marginBottom: '50px',
                }}
            >
                <img src={GoogleLogo} alt="Google" style={{ width: '35%', marginRight: '40px' }} />
                <img src={MongoDBLogo} alt="MongoDB" style={{ width: '40%' }} />
            </Box>
            <Box
                sx={{
                    width: '70vw', // same width as the text fields
                }}
            >
                <Dropdowns /> {/* Add Dropdowns component */}
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
        </Box>
    );
};

export default InputField;
