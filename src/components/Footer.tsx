import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import PeerislandsLogo from '../images/peerislands.png';
import GoogleLogo from '../images/google.png';
import MongoDBLogo from '../images/mongodb.png';

const FooterBox = styled(Box)(({ theme }) => ({
    left: 0,
    bottom: 0,
    width: '100%',
    color: theme.palette.text.primary,
    textAlign: 'center',
    padding: theme.spacing(10),
}));

const Footer: React.FC = () => {
    return (
        <FooterBox>
            <Typography variant="body2" style={{ paddingBottom: '10px' }}>Tool built by</Typography>
            <img src={PeerislandsLogo} alt="peerislands_logo" style={{ width: '8%', paddingBottom: '10px' }} />
            <Typography variant="body2" style={{ paddingBottom: '10px' }}>Powered by</Typography>
            <Typography variant="h6" style={{ paddingBottom: '10px' }}>
                <img src={GoogleLogo} alt="google_logo" style={{ width: '8%', paddingBottom: '10px', paddingRight: '20px' }} />
                <img src={MongoDBLogo} alt="mongodb_logo" style={{ width: '10%', paddingBottom: '10px' }} />
            </Typography>
        </FooterBox>
    );
};

export default Footer;
