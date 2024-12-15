import React from 'react';
import img1 from 'src/assets/icons/bus.png';
import img2 from 'src/assets/icons/bus.png';
import { Avatar, Button, Chip, Stack, Typography } from '@mui/material';
import ReusablePaginationTable from '../CustomPaginationTable';
import { Link } from 'react-router-dom';
// import ReusablePaginationTable from './CustomPaginationTable';
import iconn from '../../../../src/assets/icons/deafult.png'

const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'phone', headerName: 'Phone' },
    { field: 'dob', headerName: 'Date of birth'},
    { field: 'city', headerName: 'District'},
    { field: 'profile', headerName: 'Profile', renderCell: (value) => (<img src={value?value:iconn} style={{ width: 50, height: 50, borderRadius: '50%' }} alt='no image'/>)},
];

const handleCustomAction = (id) => {
    console.log('Custom action for id:', id);
};

const UserAll = () => (

    <div>
        <ReusablePaginationTable
        title="Services List"
        columns={columns}
        apiUrl="https://fullzapmor-api.vercel.app/api/appusers"
        // apiUrl="http://localhost:5000/api/appusers"
        enableSearch={true}
        enableSort={true}
        >
            <Button
                color="primary"
                variant="contained"
                component={Link}
                to= '/admin/adduserform'
                type="submit"
            >
                Add User
            </Button>
        </ReusablePaginationTable>
    </div>
);

export default UserAll;
