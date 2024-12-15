import React from 'react';
import img1 from 'src/assets/icons/bus.png';
import img2 from 'src/assets/icons/bus.png';
import { Avatar, Button, Chip, Stack, Typography } from '@mui/material';
import ReusablePaginationTable from '../CustomPaginationTable';
import { Link } from 'react-router-dom';
// import ReusablePaginationTable from './CustomPaginationTable';
import iconn from '../../../../src/assets/icons/deafult.png'
import doc from '../../../../src/assets/icons/DefaultDocuments.png'

const columns = [
    { field: 'organizationName', headerName: 'Organization Name' },
    { field: 'organizationWebsite', headerName: 'Organization Website' },
    { field: 'organizationLogo', headerName: 'Organization Logo' , renderCell: (value) => (<img src={value?value:iconn} style={{ width: 50, height: 50, borderRadius: '50%' }} alt='no image'/>)},
    { field: 'organizationBanner', headerName: 'Organization Banner', renderCell: (value) => (<img src={value?value:iconn} style={{ width: 50, height: 50, borderRadius: '50%' }} alt='no image'/>) },
    { field: 'organizationBio', headerName: 'Organization Bio' },
    { field: 'organizationDescription', headerName: 'Organization Description' },

    { field: 'state', headerName: 'State' },
    { field: 'city', headerName: 'District' },
    { field: 'address', headerName: 'Address' },
    { field: 'mapSelection', headerName: 'Longitude & Latitude', renderCell:(value)=>(<><p>{`Longitude : ${value[0]}`}</p> <p>{`Latitude : ${value[1]}`}</p></>) },

    { field: 'ownerName', headerName: 'Owner Name' },
    { field: 'phoneNumber', headerName: 'Owner Contact Number' },
    { field: 'emergencyPhoneNumber', headerName: 'Assistant Name' },
    { field: 'employeeNumbers', headerName: 'Assistant Contact Number' },
    { field: 'tradeLicense', headerName: 'Trade License', renderCell: (value) => (<img src={value?value:iconn} style={{ width: 50, height: 50, borderRadius: '50%' }} alt='no image'/>) },
    { field: 'organizationDocuments', headerName: 'Organization Documents', renderCell: (value) => (<img src={value?value:iconn} style={{ width: 50, height: 50, borderRadius: '50%' }} alt='no image'/>) },
    { field: 'featured', headerName: 'Featured' },
   ];
const handleCustomAction = (id) => {
    console.log('Custom action for id:', id);
};

const ServicesLocationAll = () => (

    <div>
        <ReusablePaginationTable
        title="Services Organization list"
        columns={columns}
        // apiUrl="https://fullzapmor-api.vercel.app/api/service-organization"
        apiUrl="http://127.0.0.1:8000/api/service-organizations"
        // apiUrl="http://localhost:5000/api/service-organization"
        enableSearch={true}
        enableSort={true}
        >
            <Button
            style={{marginBottom:'10px'}}
                color="primary"
                variant="contained"
                component={Link}
                to= '/admin/addserviceslocationform'
                type="submit"
            >
                Add Services Organization
            </Button>
        </ReusablePaginationTable>
    </div>
);

export default ServicesLocationAll;
