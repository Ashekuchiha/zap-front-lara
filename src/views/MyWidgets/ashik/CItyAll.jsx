import React from 'react';
import img1 from 'src/assets/icons/bus.png';
import img2 from 'src/assets/icons/bus.png';
import { Avatar, Button, Chip, Stack, Typography } from '@mui/material';
import ReusablePaginationTable from '../CustomPaginationTable';
import { Link } from 'react-router-dom';
// import ReusablePaginationTable from './CustomPaginationTable';

const columns = [
    { field: 'CityName', headerName: 'District Name' },
    { field: 'StateName', headerName: 'State Name' },
    { field: 'pin', headerName: 'PIN' },
    { field: 'longitude', headerName: 'Longitude' },
    { field: 'latitude', headerName: 'Latitude' },
   ];

const handleCustomAction = (id) => {
    console.log('Custom action for id:', id);
};

const ServicesLocationAll = () => (

    <div>
        <ReusablePaginationTable
        title="District List"
        columns={columns}
        // apiUrl="https://fullzapmor-api.vercel.app/api/cities"
        apiUrl="http://127.0.0.1:8000/api/cities"
        // apiUrl="http://localhost:5000/api/cities"
        enableSearch={true}
        enableSort={true}
        >
            <Button
                color="primary"
                variant="contained"
                component={Link}
                to= '/admin/addCityform'
                type="submit"
            >
                Add District
            </Button>
        </ReusablePaginationTable>
    </div>
);

export default ServicesLocationAll;
