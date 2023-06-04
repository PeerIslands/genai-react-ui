import React, { useState, useEffect, useContext } from 'react';
import { Drawer, IconButton, Box, Typography, Button, Divider } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import RestoreIcon from '@mui/icons-material/Restore';
import { InputContext } from './InputContext';
import axios from 'axios';
import ProfilePic from '../images/avatar.png';
import BookIcon from '@mui/icons-material/Book';
import RefreshIcon from '@mui/icons-material/Refresh';

const NavigationDrawer: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const { setInput, setPrompt, setResponse, setContext, setExamples, setTemperature, setValidSyntax, setValidSemantics } = useContext(InputContext);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        setDrawerOpen(open);
    };

    const fetchHistory = async () => {
        const response = await axios.get('http://0.0.0.0:8080/api/v1/history?limit=20');
        console.log(response.data);
        setHistoryItems(response.data);
    }

    useEffect(() => {
        if (drawerOpen) {
            fetchHistory();
        }
    }, [drawerOpen]);

    const handleHistoryClick = (item: any) => {
        setSelectedItem(item);
        setInput(item.question);
        setPrompt(item.prompt);
        setResponse(item.code);
        setContext(item.context);
        setExamples(item.examples);
        setTemperature(item.temperature);
        setValidSyntax(item.validSyntax);
        setValidSemantics(item.validSemantics);
    };

    const list = () => (
        <Box
            sx={{ width: 900 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 2, paddingTop: 2, alignItems: 'center' }}>
                <Typography variant="h6" sx={{ paddingRight: 2 }}>History</Typography>
                <IconButton onClick={(event) => {
                    event.stopPropagation();
                    fetchHistory();
                }}>
                    <RefreshIcon />
                </IconButton>
            </Box>
            <Divider />
            <List>
                {historyItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListItem button onClick={() => handleHistoryClick(item)}>
                            <ListItemIcon>
                                <RestoreIcon />
                            </ListItemIcon>
                            <ListItemText primary={item['question']} />
                        </ListItem>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <Button
                onClick={toggleDrawer(true)} style={{ position: 'fixed', right: '20px', top: '20px' }}>
                {/* <Avatar src={ProfilePic} alt="Profile" style={{ border: "1.5px solid white" }} /> */}
                <BookIcon sx={{ color: "#00684A", border: "1.5px solid white" }} />
                <Typography variant="body2" style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '2px', color: 'black' }}>History</Typography>
            </Button>
            <Drawer anchor='right' open={drawerOpen} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </>
    );
}

export default NavigationDrawer;
