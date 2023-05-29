import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import SendIcon from '@mui/icons-material/Send';
import Divider from "@mui/material/Divider";
import axios from "axios";

const MongoLogin = () => {
    const [open, setOpen] = useState(false);
    const [mongoURI, setMongoURI] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setMongoURI(event.target.value);


    const connectToDatabase = async () => {
        try {
            const response = await axios.post('http://your-api-url.com/connect', { uri: mongoURI });
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const body = (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                borderRadius: "8px",
                padding: "30px",
                paddingBottom: "20px",
                outline: "none",
                minWidth: "400px",
                minHeight: "200px"
            }}
        >
            <TextField
                label="Enter MongoDB URI"
                variant="outlined"
                fullWidth
                margin="normal"
                style={{ marginBottom: "20px" }}
                InputProps={{ style: { fontSize: "18px" } }}
                onChange={handleChange}
            />
            <Divider style={{ marginBottom: "20px", paddingTop: "50px" }} />
            <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                style={{ float: "right" }}
                onClick={connectToDatabase}
            >
                Connect
            </Button>
            <Button
                variant="outlined"
                color="primary"
                style={{ float: "right", marginRight: "10px" }}
                onClick={handleClose}
            >
                Close
            </Button>
        </div>
    );

    return (
        <>
            <Button
                variant="outlined"
                color="primary"
                style={{
                    position: "absolute",
                    top: "25px",
                    right: "25px",
                    padding: "10px",
                    color: "primary",
                    boxShadow: "none",
                }}
                onClick={handleOpen}
            >
                Connect
            </Button>
            <Modal open={open} onClose={handleClose}>
                {body}
            </Modal>
        </>
    );
};

export default MongoLogin;
