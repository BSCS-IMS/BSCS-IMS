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

function createData(id, sku, productName, location) {
  return { id, sku, productName, location};
}


const rows = [
  { id: 1, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 120 }], location: "Warehouse A" },
  { id: 2, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 80 }], location: "Warehouse A" },
  { id: 3, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 200 }], location: "Warehouse A" },

  { id: 4, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 60 }], location: "Warehouse B" },
  { id: 5, sku: "OIL-1L", products: [{ name: "Cooking Oil 1L", quantity: 45 }], location: "Warehouse B" },

  { id: 6, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 30 }], location: "Store 1" },
  { id: 7, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 20 }], location: "Store 1" },
  { id: 8, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 50 }], location: "Store 1" },
  { id: 9, sku: "SLT-500", products: [{ name: "Salt 500g", quantity: 70 }], location: "Store 1" },

  { id: 10, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 25 }], location: "Store 2" },

  { id: 11, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 150 }], location: "Warehouse C" },
  { id: 12, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 100 }], location: "Warehouse C" },
  { id: 13, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 180 }], location: "Warehouse C" },
  { id: 14, sku: "OIL-1L", products: [{ name: "Cooking Oil 1L", quantity: 90 }], location: "Warehouse C" },
  { id: 15, sku: "SLT-500", products: [{ name: "Salt 500g", quantity: 130 }], location: "Warehouse C" },

  { id: 16, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 35 }], location: "Store 3" },
  { id: 17, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 60 }], location: "Store 3" },

  { id: 18, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 18 }], location: "Store 4" },
  { id: 19, sku: "SLT-500", products: [{ name: "Salt 500g", quantity: 40 }], location: "Store 4" },

  { id: 20, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 90 }], location: "Warehouse D" },
  { id: 21, sku: "OIL-1L", products: [{ name: "Cooking Oil 1L", quantity: 55 }], location: "Warehouse D" },

  { id: 22, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 28 }], location: "Store 5" },
  { id: 23, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 22 }], location: "Store 5" },

  { id: 24, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 160 }], location: "Warehouse E" },
  { id: 25, sku: "SLT-500", products: [{ name: "Salt 500g", quantity: 140 }], location: "Warehouse E" },

  { id: 26, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 32 }], location: "Store 6" },
  { id: 27, sku: "OIL-1L", products: [{ name: "Cooking Oil 1L", quantity: 20 }], location: "Store 6" },

  { id: 28, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 24 }], location: "Store 7" },
  { id: 29, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 45 }], location: "Store 7" },

  { id: 30, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 110 }], location: "Warehouse F" },
  { id: 31, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 75 }], location: "Warehouse F" },
  { id: 32, sku: "SLT-500", products: [{ name: "Salt 500g", quantity: 95 }], location: "Warehouse F" },

  { id: 33, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 40 }], location: "Store 8" },
  { id: 34, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 55 }], location: "Store 8" },
  { id: 35, sku: "SLT-500", products: [{ name: "Salt 500g", quantity: 60 }], location: "Store 8" },

  { id: 36, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 85 }], location: "Warehouse G" },
  { id: 37, sku: "OIL-1L", products: [{ name: "Cooking Oil 1L", quantity: 65 }], location: "Warehouse G" },

  { id: 38, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 20 }], location: "Store 9" },

  { id: 39, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 48 }], location: "Store 10" },
  { id: 40, sku: "SLT-500", products: [{ name: "Salt 500g", quantity: 52 }], location: "Store 10" },

  { id: 41, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 140 }], location: "Warehouse H" },
  { id: 42, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 95 }], location: "Warehouse H" },
  { id: 43, sku: "OIL-1L", products: [{ name: "Cooking Oil 1L", quantity: 70 }], location: "Warehouse H" },

  { id: 44, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 33 }], location: "Store 11" },
  { id: 45, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 26 }], location: "Store 11" },
  { id: 46, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 58 }], location: "Store 11" },

  { id: 47, sku: "R25-001", products: [{ name: "Rice 25kg", quantity: 160 }], location: "Warehouse I" },
  { id: 48, sku: "R50-001", products: [{ name: "Rice 50kg", quantity: 120 }], location: "Warehouse I" },
  { id: 49, sku: "S01-001", products: [{ name: "Sugar 1kg", quantity: 190 }], location: "Warehouse I" },
  { id: 50, sku: "SLT-500", products: [{ name: "Salt 500g", quantity: 150 }], location: "Warehouse I" },
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
    row.sku.toLowerCase().includes(search.toLowerCase()) ||
    row.productName.toLowerCase().includes(search.toLowerCase()) ||
    row.location.toLowerCase().includes(search.toLowerCase())
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
              <TableCell sx={{ fontWeight: 'bold' }}>Product ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Product Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.flatMap((row) =>
              row.products.map((product, index) => (
                <TableRow key={`${row.id}-${index}`} hover>
                  {/* SKU comes from row */}
                  <TableCell>{row.sku}</TableCell>

                  {/* Product name + quantity */}
                  <TableCell>{product.name} ({product.quantity} qty)</TableCell>

                  {/* Location */}
                  <TableCell>{row.location}</TableCell>

                  {/* Actions */}
                  <TableCell>
                    <IconButton onClick={() => handleEdit(row.id)} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(row.id)} size="small" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
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