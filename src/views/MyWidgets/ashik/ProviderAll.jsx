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
    { field: 'email', headerName: 'E-mail' },
    { field: 'phoneNumber', headerName: 'Phone Number' },
    { field: 'assistantName', headerName: 'Assistent Name' },
    { field: 'assistantphoneNumber', headerName: 'Assistant Phone Number' },
    { field: 'qualification', headerName: 'Qualification' },
    { field: 'specialized', headerName: 'Exparties'},
    { field: 'experience', headerName: 'Experience' },
    { field: 'service', headerName: 'Service'},
    { field: 'organizationMobile', headerName: 'Organization Mobile' },
    { field: 'serviceOrganization', headerName: 'Service Organization'},
    { field: 'amount', headerName: 'Amount'},
    { field: 'type', headerName: 'Type'},
    { field: 'certificate', headerName: 'Cover photo', renderCell: (value) => (<img src={value?(value==='null'?iconn:value):iconn} style={{ width: 50, height: 50, borderRadius: '50%' }} alt='no image'/>) },
    { field: 'profileImage', headerName: 'Profile Image', renderCell: (value) => (<img src={value?(value==='null'?iconn:value):iconn} style={{ width: 50, height: 50, borderRadius: '50%' }} alt='no image'/>) },
    { field: 'status', headerName: 'Status'},
    { field: 'featured', headerName: 'Featured'},
];

const handleCustomAction = (id) => {
    console.log('Custom action for id:', id);
};

const ProviderAll = () => (


    <div>
        <ReusablePaginationTable
        title="Services List"
        columns={columns}
        // apiUrl="https://fullzapmor-api.vercel.app/api/services-providers"
        apiUrl="http://127.0.0.1:8000/api/servicesproviders"
        // apiUrl="http://localhost:5000/api/services-providers"
        enableSearch={true}
        enableSort={true}
        >
            <Button
                color="primary"
                variant="contained"
                component={Link}
                to='/admin/addproviderform'
                type="submit"
            >
                Add Provider/Vendor
            </Button>
        </ReusablePaginationTable>
    </div>
);

export default ProviderAll;
