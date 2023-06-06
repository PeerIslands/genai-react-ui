import React, { useState, useEffect, useContext } from 'react';
import { Drawer, IconButton, Box, Typography, Button, Divider, Menu, MenuItem } from '@mui/material';
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const NavigationDrawer: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [historyItems, setHistoryItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const { setInput, setPrompt, setResponse, setContext, setExamples, setTemperature, setValidSyntax, setValidSemantics } = useContext(InputContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        setDrawerOpen(open);
    };

    const fetchHistory = async () => {
        const response = await axios.get('http://0.0.0.0:8080/api/v1/history?limit=20');
        console.log(response.data);
        setHistoryItems(response.data);
    }

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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
                onClick={toggleDrawer(true)} style={{ position: 'fixed', left: '20px', top: '20px' }}>
                <BookIcon sx={{ color: "#00684A", border: "1.5px solid white" }} />
                <Typography variant="body2" style={{ paddingLeft: '10px', paddingRight: '10px', paddingTop: '2px', color: 'black' }}>History</Typography>
            </Button>
            <Button
                onClick={handleButtonClick}
                style={{ position: 'fixed', right: '25px', top: '15px', textTransform: 'none' }}
                variant="outlined"
                sx={{
                    borderRadius: '25px',
                    borderColor: 'primary.main',
                    '&:hover': {
                        borderColor: 'primary.dark',
                    }
                }}
            >
                <Box component="span" sx={{ pr: 1 }}>John Doe</Box>
                <ArrowDropDownIcon />
            </Button>
            <Menu
                id="user-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Atlas</MenuItem>
                <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
                <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
            <Drawer anchor='left' open={drawerOpen} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </>
    );
}

export default NavigationDrawer;
