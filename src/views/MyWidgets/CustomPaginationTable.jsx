import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
    Table, TableBody, TableCell, TableHead, TableRow,
    TablePagination, IconButton, InputBase, Paper, Box,
    Stack, Typography, Button, Checkbox, Menu, MenuItem,
    useMediaQuery, useTheme, MenuButton,
    Avatar
} from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon, Delete as DeleteIcon, Edit as EditIcon, MoreHoriz } from '@mui/icons-material';
import axios from 'axios';
import Spinner from '../spinner/Spinner';
import ConfirmationDialog from './ConfirmationDialog';
import ParentCard from 'src/components/shared/ParentCard';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

import defaultImage from './bus.png';

function ReusablePaginationTable({
    children,columns, apiUrl, rowsPerPageOptions = [10, 15, 25], defaultRowsPerPage = 20,
    title, enableSearch = true, enableSort = true, bulkActions = []
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [data, setData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogLoading, setDialogLoading] = useState(false);
    const [actionMenuAnchorEl, setActionMenuAnchorEl] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate(); // Initialize useNavigate

    const fetchData = async (pageNumber) => {
        setLoading(true);
        try {
            const response = await axios.get(`${apiUrl}?page=${pageNumber}&per_page=${rowsPerPage}`);
            const { data: apiData } = response.data;
            setData(apiData.data);
            setTotalPages(apiData.last_page);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData(page + 1);
    }, [page, rowsPerPage]);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (column) => {
        const isAsc = sortConfig.key === column.field && sortConfig.direction === 'asc';
        setSortConfig({ key: column.field, direction: isAsc ? 'desc' : 'asc' });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(data.map(row => row.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectRow = (id) => {
        setSelectedIds(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(item => item !== id)
                : [...prevSelected, id]
        );
    };

    const getFormattedDate = () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleExportCSV = () => {
        const csvData = data.filter(row => selectedIds.includes(row.id));
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${getFormattedDate()}-${apiUrl.split('/').pop()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportExcel = () => {
        const excelData = data.filter(row => selectedIds.includes(row.id));
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${getFormattedDate()}-${apiUrl.split('/').pop()}.xlsx`);
    };

    const handleExportPDF = () => {
        const pdf = new jsPDF();
        const exportData = data.filter(row => selectedIds.includes(row.id));

        const headers = columns.map(col => col.headerName);
        const rows = exportData.map(row => columns.map(col => row[col.field]));

        pdf.autoTable({
            head: [headers],
            body: rows,
            startY: 20,
            margin: { horizontal: 10 },
            styles: { fontSize: 10 },
        });

        pdf.save(`${getFormattedDate()}-${apiUrl.split('/').pop()}.pdf`);
    };

    const handleBulkAction = (action) => {
        if (action === 'export-csv') {
            handleExportCSV();
        } else if (action === 'export-excel') {
            handleExportExcel();
        } else if (action === 'export-pdf') {
            handleExportPDF();
        } else if (action === 'delete') {
            setOpenDialog(true);
        }
    };

    // const confirmDelete = async () => {
    //     setDialogLoading(true);
    //     try {
    //         await axios.delete(`${apiUrl}`, { data: { ids: selectedIds } });
    //         setData(prevData => prevData.filter(item => !selectedIds.includes(item.id)));
    //         setSelectedIds([]);
    //     } catch (error) {
    //         console.error("Error deleting items", error);
    //     } finally {
    //         setDialogLoading(false);
    //         setOpenDialog(false);
    //     }
    // };
    //ashik s
    const confirmDelete = async () => {
        setDialogLoading(true);
        try {
            // Send DELETE request with selected IDs
            await axios.delete(`${apiUrl}/delete-multiple`, { data: { ids: selectedIds } });

            
            // Filter out the deleted items from the local state
            setData(prevData => prevData.filter(item => !selectedIds.includes(item.id)));
    
            // Clear the selected IDs
            setSelectedIds([]);
        } catch (error) {
            console.error("Error deleting items", error);
            // Optionally, add user feedback here, e.g., toast notification
        } finally {
            // Stop the loading state and close the dialog
            setDialogLoading(false);
            setOpenDialog(false);
        }
    };
    //ashik e
    const handleEdit = (id) => {
        navigate(`${location.pathname}/edit/${id}`);
        console.log(id)
    };

    const handleDelete = async (id) => {
        setCurrentId(id);
        setOpenDialog(true);
        console.log(id)
    };

    const confirmDeleteSingle = async () => {
        setDialogLoading(true);
        try {
            await axios.delete(`${apiUrl}/${currentId}`, {
                headers: {
                    'Accept': 'application/json', // Ensure API expects JSON
                },
            });
            setData(prevData => prevData.filter(item => item.id !== currentId));
            setCurrentId(null);
        } catch (error) {
            console.error("Error deleting item", error);
        } finally {
            setDialogLoading(false);
            setOpenDialog(false);
        }
    };

    const filteredData = useMemo(() => {
        let filtered = data;

        if (enableSearch && searchTerm) {
            filtered = filtered.filter(row =>
                Object.values(row).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (enableSort && sortConfig.key) {
            filtered = filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return filtered;
    }, [data, searchTerm, sortConfig, enableSearch, enableSort]);

    const showExportOptions = selectedIds.length > 0;
    return (
        <>
            <ParentCard title={title}>
                {/* ashik s */}
                {children} 
                {/* ashik e */}
                <Paper variant='outlined'>
                    <Box sx={{ padding: '16px', backgroundColor: 'transparent' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                {enableSearch && (
                                    <InputBase
                                        startAdornment={<SearchIcon />}
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        sx={{
                                            padding: '0 8px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            height: '32px',
                                            maxWidth: isMobile ? '100%' : '50%',
                                            flex: 1
                                        }}
                                    />
                                )}
                            </Box>
                            {isMobile ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(event) => setAnchorEl(event.currentTarget)}
                                >
                                    Bulk Actions
                                </Button>
                            ) : (
                                <Stack direction="row" spacing={1}>
                                    {showExportOptions && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleExportCSV}
                                                startIcon={<DownloadIcon />}
                                            >
                                                Export CSV
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleExportExcel}
                                                startIcon={<DownloadIcon />}
                                            >
                                                Export Excel
                                            </Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleExportPDF}
                                                startIcon={<DownloadIcon />}
                                            >
                                                Export PDF
                                            </Button>
                                        </>
                                    )}
                                    {showExportOptions && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleBulkAction('delete')}
                                            startIcon={<DeleteIcon />}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </Stack>
                            )}
                        </Stack>
                    </Box>
                    <Box sx={{ overflowX: 'auto' }}>
                        {loading ? (
                            <Spinner />
                        ) : (
                            <>
                                {filteredData.length === 0 ? (
                                    <Box sx={{ padding: '16px', textAlign: 'center' }}>
                                        <Typography variant="h6">No data available</Typography>
                                    </Box>
                                ) : (
                                    <>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            checked={selectedIds.length === data.length}
                                                            indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                                                            onChange={handleSelectAll}
                                                        />
                                                    </TableCell>
                                                    {columns.map((column) => (
                                                        <TableCell
                                                            key={column.field}
                                                            sx={{
                                                                position: 'relative',
                                                                paddingRight: '40px',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <Box
                                                                    onClick={() => enableSort && handleSort(column)}
                                                                    sx={{ cursor: enableSort ? 'pointer' : 'default' }}
                                                                >
                                                                    {column.headerName}
                                                                    {enableSort && sortConfig.key === column.field && (
                                                                        <span style={{ marginLeft: '4px', fontSize: '0.75rem' }}>
                                                                            {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                                                        </span>
                                                                    )}
                                                                </Box>
                                                            </Stack>
                                                        </TableCell>
                                                    ))}
                                                    <TableCell>Action</TableCell> {/* Action Column */}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {filteredData.map((row) => (
                                                    <TableRow key={row.id}>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={selectedIds.includes(row.id)}
                                                                onChange={() => handleSelectRow(row.id)}
                                                            />
                                                        </TableCell>
                                                        {columns.map((column) => (
                                                            // column.field === 'icon' ? 
                                                            // <Avatar src= {defaultImage} alt='bus.png' width="35"  sx={{ marginTop: 2}}/> 
                                                            // // <img 
                                                            // //     src={ defaultImage} 
                                                            // //     alt='no' 
                                                            // //     width="35" 
                                                            // // />
                                                            // : 
                                                            <TableCell key={column.field}>
                                                                {/* {console.log('cc',column.field)} */}
                                                                {column.renderCell ? column.renderCell(row[column.field], row) : row[column.field]}
                                                            </TableCell>
                                                        ))}
                                                        <TableCell>
                                                            <IconButton
                                                                onClick={(event) => {
                                                                    event.stopPropagation();
                                                                    setCurrentId(row.id);
                                                                    setActionMenuAnchorEl(event.currentTarget);
                                                                }}
                                                            >
                                                                <MoreHoriz />
                                                            </IconButton>
                                                            <Menu
                                                                anchorEl={actionMenuAnchorEl}
                                                                open={Boolean(actionMenuAnchorEl)}
                                                                onClose={() => setActionMenuAnchorEl(null)}
                                                            >
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        setActionMenuAnchorEl(null);
                                                                        handleEdit(currentId);
                                                                    }}
                                                                >
                                                                    Edit
                                                                </MenuItem>
                                                                <MenuItem
                                                                    onClick={() => {
                                                                        setActionMenuAnchorEl(null);
                                                                        handleDelete(currentId);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </MenuItem>
                                                            </Menu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <TablePagination
                                            rowsPerPageOptions={rowsPerPageOptions}
                                            component="div"
                                            count={totalPages * rowsPerPage}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </>
                                )}
                            </>
                        )}
                    </Box>

                    {/* Mobile Menu for Bulk Actions */}
                    {isMobile && (
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            {showExportOptions && (
                                <>
                                    <MenuItem onClick={handleExportCSV}>Export CSV</MenuItem>
                                    <MenuItem onClick={handleExportExcel}>Export Excel</MenuItem>
                                    <MenuItem onClick={handleExportPDF}>Export PDF</MenuItem>
                                    <MenuItem onClick={() => handleBulkAction('delete')}>Delete</MenuItem>
                                </>
                            )}
                        </Menu>
                    )}

                    {/* Confirmation Dialog */}
                    <ConfirmationDialog
                        open={openDialog}
                        onClose={() => setOpenDialog(false)}
                        onConfirm={currentId ? confirmDeleteSingle : confirmDelete}
                        loading={dialogLoading}
                    />
                </Paper>
            </ParentCard >
        </>
    );
}

ReusablePaginationTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            field: PropTypes.string.isRequired,
            headerName: PropTypes.string.isRequired,
            renderCell: PropTypes.func,
        })
    ).isRequired,
    apiUrl: PropTypes.string.isRequired,
    rowsPerPageOptions: PropTypes.array,
    defaultRowsPerPage: PropTypes.number,
    title: PropTypes.string,
    enableSearch: PropTypes.bool,
    enableSort: PropTypes.bool,
    bulkActions: PropTypes.arrayOf(PropTypes.string),
};

export default ReusablePaginationTable;
