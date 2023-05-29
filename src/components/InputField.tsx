import React, { useState } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const InputField: React.FC = () => {
    const [input, setInput] = useState("");
    const [response, setResponse] = useState("");

    const handleButtonClick = async () => {
        // Replace with your API call
        console.log(input);

        // Mock response
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
                height: '100vh'
            }}
        >
            <TextField
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question to MongoDB"
                multiline
                rows={4}
                variant="outlined"
                sx={{ width: '70vw' }}
            />
            <Button variant="contained" onClick={handleButtonClick}>Submit</Button>
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
