import React from "react";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { SelectChangeEvent } from '@mui/material';

// Dummy data
const databases = ['db1', 'db2', 'db3'];
const collections = ['collection1', 'collection2', 'collection3'];

const Dropdowns: React.FC = () => {
    const [database, setDatabase] = React.useState('');
    const [collection, setCollection] = React.useState('');

    const handleDatabaseChange = (event: SelectChangeEvent) => {
        setDatabase(event.target.value as string);
    };

    const handleCollectionChange = (event: SelectChangeEvent) => {
        setCollection(event.target.value as string);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '20px' }}>
            <FormControl variant="outlined" style={{ width: '48%' }}>
                <InputLabel id="database-label">Database</InputLabel>
                <Select
                    labelId="database-label"
                    value={database}
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
                    value={collection}
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
    );
};

export default Dropdowns;
