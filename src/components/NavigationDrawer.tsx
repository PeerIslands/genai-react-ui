import React, { useState, useContext } from 'react';
import { Drawer, IconButton, Box } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import KeyIcon from '@mui/icons-material/Key';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { QueryContext } from './QueryContext';
import { InputContext } from './InputContext';

// Import the image for the avatar
import ProfilePic from '../images/avatar.png';

const NavigationDrawer: React.FC = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { history } = useContext(QueryContext);
    const { setInput } = useContext(InputContext);

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        setDrawerOpen(open);
    };

    const list = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {history.map((query, index) => (
                    <ListItem button key={index} onClick={() => setInput(query)}>
                        <ListItemText primary={query} />
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
