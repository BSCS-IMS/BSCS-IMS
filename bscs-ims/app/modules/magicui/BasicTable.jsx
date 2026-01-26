"use client"
import { useState } from "react";
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

function createData(id, location, products) {
  return { id, location, products };
}

const rows = [
  createData(1, "Warehouse A", ["Rice 25kg", "Rice 50kg", "Sugar 1kg"]),
  createData(2, "Warehouse B", ["Rice 25kg", "Cooking Oil 1L"]),
  createData(3, "Store 1", ["Rice 25kg", "Rice 50kg", "Sugar 1kg", "Salt 500g"]),
  createData(4, "Store 2", ["Rice 25kg"]),
  createData(5, "Warehouse C", ["Rice 25kg", "Rice 50kg", "Sugar 1kg", "Cooking Oil 1L", "Salt 500g"]),
  createData(6, "Store 3", ["Rice 25kg", "Sugar 1kg"]),
  createData(7, "Store 4", ["Rice 50kg", "Salt 500g"]),
  createData(8, "Warehouse D", ["Rice 25kg", "Cooking Oil 1L"]),
  createData(9, "Store 5", ["Rice 25kg", "Rice 50kg"]),
  createData(10, "Warehouse E", ["Sugar 1kg", "Salt 500g"]),
  createData(11, "Store 6", ["Rice 25kg", "Cooking Oil 1L"]),
  createData(12, "Store 7", ["Rice 50kg", "Sugar 1kg"]),
  createData(13, "Warehouse F", ["Rice 25kg", "Rice 50kg", "Salt 500g"]),
  createData(14, "Store 8", ["Rice 25kg", "Sugar 1kg", "Salt 500g"]),
  createData(15, "Warehouse G", ["Rice 50kg", "Cooking Oil 1L"]),
  createData(16, "Store 9", ["Rice 25kg"]),
  createData(17, "Store 10", ["Sugar 1kg", "Salt 500g"]),
  createData(18, "Warehouse H", ["Rice 25kg", "Rice 50kg", "Cooking Oil 1L"]),
  createData(19, "Store 11", ["Rice 25kg", "Rice 50kg", "Sugar 1kg"]),
  createData(20, "Warehouse I", ["Rice 25kg", "Rice 50kg", "Sugar 1kg", "Salt 500g"])
];

export default function InventoryTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleEdit = (id) => {
    console.log("Edit location:", id);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log("Delete location:", id);
    // Add your delete logic here
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rows.filter(row => 
    row.location.toLowerCase().includes(search.toLowerCase()) ||
    row.products.some(product => product.toLowerCase().includes(search.toLowerCase()))
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ bgcolor: "#f5f7fb", minHeight: "100vh", py: 4 }}>
      {/* Centered container */}
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 2 }}>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight={700}>
            Inventory
          </Typography>
          <Button variant="text" 
          sx={{ color: "#1F384C", flexDirection: "column", minWidth: "auto",textTransform:"none" }}>
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
            sx={{ backgroundColor: "#1F384C",color: "#fff",textTransform: "none","&:hover": {backgroundColor: "#162A3F",},height: "30px",}}>
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
                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Location Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Products Associated</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ 
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: '#f9fafb' }
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.location}
                  </TableCell>
                  <TableCell>
                    {row.products.map((product, index) => (
                      <div key={index}>{product}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(row.id)}
                      color="primary"
                      size="small"
                      title="Edit"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(row.id)}
                      color="error"
                      size="small"
                      title="Delete"
                    >
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