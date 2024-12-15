import React from 'react';
import img1 from 'src/assets/icons/bus.png';
import img2 from 'src/assets/icons/bus.png';
import { Avatar, Button, Chip, Stack, Typography } from '@mui/material';
import ReusablePaginationTable from './CustomPaginationTable';

const columns = [
    { field: 'name', headerName: 'Name' },
    { field: 'sku', headerName: 'SKU' },
    { field: 'barcode', headerName: 'Barcode' },
    { field: 'cost_price', headerName: 'Cost Price', renderCell: (value) => `$${value}` },
    { field: 'selling_price', headerName: 'Selling Price', renderCell: (value) => `$${value}` },
    { field: 'stock_qty', headerName: 'Stock Qty' },
    { field: 'discount', headerName: 'Discount', renderCell: (value) => `$${value}` },
    { field: 'vat', headerName: 'VAT', renderCell: (value) => `$${value}` },
    { field: 'tax', headerName: 'Tax', renderCell: (value) => `$${value}` },
];

const handleCustomAction = (id) => {
    console.log('Custom action for id:', id);
};

const MyTablePage = () => (


    <div>
        <ReusablePaginationTable
            title="Product List"
            columns={columns}
            apiUrl="https://my-pos.sohabagcluster.com/api/products"
            enableSearch={true}
            enableSort={true}
        >
        </ReusablePaginationTable>
    </div>
);

export default MyTablePage;
