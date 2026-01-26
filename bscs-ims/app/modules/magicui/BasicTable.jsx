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
  createData(1, "Warehouse A", [
    { name: "Rice 25kg", quantity: 120 },
    { name: "Rice 50kg", quantity: 80 },
    { name: "Sugar 1kg", quantity: 200 }
  ]),
  createData(2, "Warehouse B", [
    { name: "Rice 25kg", quantity: 60 },
    { name: "Cooking Oil 1L", quantity: 45 }
  ]),
  createData(3, "Store 1", [
    { name: "Rice 25kg", quantity: 30 },
    { name: "Rice 50kg", quantity: 20 },
    { name: "Sugar 1kg", quantity: 50 },
    { name: "Salt 500g", quantity: 70 }
  ]),
  createData(4, "Store 2", [
    { name: "Rice 25kg", quantity: 25 }
  ]),
  createData(5, "Warehouse C", [
    { name: "Rice 25kg", quantity: 150 },
    { name: "Rice 50kg", quantity: 100 },
    { name: "Sugar 1kg", quantity: 180 },
    { name: "Cooking Oil 1L", quantity: 90 },
    { name: "Salt 500g", quantity: 130 }
  ]),
  createData(6, "Store 3", [
    { name: "Rice 25kg", quantity: 35 },
    { name: "Sugar 1kg", quantity: 60 }
  ]),
  createData(7, "Store 4", [
    { name: "Rice 50kg", quantity: 18 },
    { name: "Salt 500g", quantity: 40 }
  ]),
  createData(8, "Warehouse D", [
    { name: "Rice 25kg", quantity: 90 },
    { name: "Cooking Oil 1L", quantity: 55 }
  ]),
  createData(9, "Store 5", [
    { name: "Rice 25kg", quantity: 28 },
    { name: "Rice 50kg", quantity: 22 }
  ]),
  createData(10, "Warehouse E", [
    { name: "Sugar 1kg", quantity: 160 },
    { name: "Salt 500g", quantity: 140 }
  ]),
  createData(11, "Store 6", [
    { name: "Rice 25kg", quantity: 32 },
    { name: "Cooking Oil 1L", quantity: 20 }
  ]),
  createData(12, "Store 7", [
    { name: "Rice 50kg", quantity: 24 },
    { name: "Sugar 1kg", quantity: 45 }
  ]),
  createData(13, "Warehouse F", [
    { name: "Rice 25kg", quantity: 110 },
    { name: "Rice 50kg", quantity: 75 },
    { name: "Salt 500g", quantity: 95 }
  ]),
  createData(14, "Store 8", [
    { name: "Rice 25kg", quantity: 40 },
    { name: "Sugar 1kg", quantity: 55 },
    { name: "Salt 500g", quantity: 60 }
  ]),
  createData(15, "Warehouse G", [
    { name: "Rice 50kg", quantity: 85 },
    { name: "Cooking Oil 1L", quantity: 65 }
  ]),
  createData(16, "Store 9", [
    { name: "Rice 25kg", quantity: 20 }
  ]),
  createData(17, "Store 10", [
    { name: "Sugar 1kg", quantity: 48 },
    { name: "Salt 500g", quantity: 52 }
  ]),
  createData(18, "Warehouse H", [
    { name: "Rice 25kg", quantity: 140 },
    { name: "Rice 50kg", quantity: 95 },
    { name: "Cooking Oil 1L", quantity: 70 }
  ]),
  createData(19, "Store 11", [
    { name: "Rice 25kg", quantity: 33 },
    { name: "Rice 50kg", quantity: 26 },
    { name: "Sugar 1kg", quantity: 58 }
  ]),
  createData(20, "Warehouse I", [
    { name: "Rice 25kg", quantity: 160 },
    { name: "Rice 50kg", quantity: 120 },
    { name: "Sugar 1kg", quantity: 190 },
    { name: "Salt 500g", quantity: 150 }
  ])
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
                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Products</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Quantity</TableCell>
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
                      <div key={index}>{product.name}</div>
                    ))}
                  </TableCell>
                  <TableCell>
                    {row.products.map((product, index) => (
                      <div key={index}>{product.quantity}</div>
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