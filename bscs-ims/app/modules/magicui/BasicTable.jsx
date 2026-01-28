"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SortIcon from '@mui/icons-material/Sort';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function InventoryTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch inventory from API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("/api/inventory"); // Your backend should return productName & locationName

        if (res.data.success) {
          const transformedRows = res.data.data.map(item => ({
            id: item.id,                 // ${productId}_${locationId}
            productId: item.productId,
            locationId: item.locationId,
            location: item.locationName, // Make sure API returns location name
            product: {
              name: item.productName,    // Make sure API returns product name
              quantity: item.quantity
            }
          }));

          setRows(transformedRows);
        }
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Edit/Delete handlers
  const handleEdit = (row) => {
    console.log("Edit inventory:", row);
    // Send productId + locationId to backend for edit
  };

  const handleDelete = (row) => {
    console.log("Delete inventory:", row);
    // Send productId + locationId to backend for delete
  };

  // Filter rows by search input
  const filteredRows = rows.filter(row =>
    row.location.toLowerCase().includes(search.toLowerCase()) ||
    row.product.name.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight={700}>
            Inventory
          </Typography>
          <Button variant="text" 
            sx={{ color: "#1F384C", flexDirection: "column", minWidth: "auto", textTransform:"none" }}>
            <AddIcon sx={{ fontSize: 18 }} />
            Add
          </Button>
        </Stack>

        {/* Search + Actions */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              placeholder="Search"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ width: 700 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="text"
              sx={{ backgroundColor: "#1F384C", color: "#fff", textTransform: "none",
                    "&:hover": {backgroundColor: "#162A3F"}, height: "30px" }}>
              Search
            </Button>
            <Button variant="text"
              sx={{ color:"#1F384C", flexDirection:"column", minWidth:"auto", textTransform:"none" }}>
              <FilterAltOutlinedIcon sx={{ fontSize: 18 }} />
              Filter
            </Button>     
            <Button startIcon={<SortIcon sx={{ fontSize: 18 }} />} variant="text"
              sx={{ color:"#1F384C", flexDirection:"column", minWidth:"auto", textTransform:"none" }}>
              Asc
            </Button>
            <Button startIcon={<SortIcon sx={{ fontSize: 18 }} />} variant="text"
              sx={{ color:"#1F384C", flexDirection:"column", minWidth:"auto", textTransform:"none" }}>
              Desc
            </Button>
          </Stack>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="inventory table">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.product.name} ({row.product.quantity} qty)</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(row)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row)} size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>
    </Box>
  );
}
