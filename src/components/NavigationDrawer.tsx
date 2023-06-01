import React, { useState, useEffect, useContext } from 'react';
import { Drawer, IconButton, Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';
import RestoreIcon from '@mui/icons-material/Restore';
import { InputContext } from './InputContext';
import axios from 'axios';
import ProfilePic from '../images/avatar.png';

const NavigationDrawer: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const { setInput, setPrompt, setResponse } = useContext(InputContext);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        setDrawerOpen(open);
    };

    const fetchHistory = async () => {
        const response = await axios.get('http://0.0.0.0:8080/api/v1/history');
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
    };

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {historyItems.map((item, index) => (
                    <ListItem button key={index} onClick={() => handleHistoryClick(item)}>
                        <ListItemIcon>
                            <RestoreIcon />
                        </ListItemIcon>
                        <ListItemText primary={item['question']} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <IconButton onClick={toggleDrawer(true)} style={{ position: 'fixed', left: '20px', top: '20px' }}>
                <Avatar src={ProfilePic} alt="Profile" style={{ border: "1.5px solid white" }} />
            </IconButton>
            <Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </>
    );
}

export default NavigationDrawer;
