import React from 'react';
import img1 from 'src/assets/icons/bus.png';
import img2 from 'src/assets/icons/bus.png';
import { Avatar, Button, Chip, Stack, Typography } from '@mui/material';
import ReusablePaginationTable from '../CustomPaginationTable';
import { Link } from 'react-router-dom';
// import ReusablePaginationTable from './CustomPaginationTable';

const columns = [
    { field: 'StateName', headerName: 'State Name' },
    { field: 'longitude', headerName: 'Longitude' },
    { field: 'latitude', headerName: 'Latitude' },
   ];

const handleCustomAction = (id) => {
    console.log('Custom action for id:', id);
};

const ServicesLocationAll = () => (

    <div>
        <ReusablePaginationTable
        title="Services List"
        columns={columns}
        // apiUrl="https://fullzapmor-api.vercel.app/api/states"
        apiUrl="http://127.0.0.1:8000/api/states"
        enableSearch={true}
        enableSort={true}
        >
            <Button
                color="primary"
                variant="contained"
                component={Link}
                to= '/admin/addStateform'
                type="submit"
            >
                Add State
            </Button>
        </ReusablePaginationTable>
    </div>
);

export default ServicesLocationAll;
