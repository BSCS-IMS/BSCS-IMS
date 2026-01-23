"use client";


import { useState } from "react";

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  InputAdornment,
  Stack,
  Tooltip,
} from "@mui/material";


import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([
    {
      id: 1,
      image: "https://via.placeholder.com/50",
      name: "Rice 5kg",
      quantity: 20,
      price: 250,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/50",
      name: "Rice 10kg",
      quantity: 15,
      price: 480,
    },
  ]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (!confirm("Delete this product?")) return;
    setProducts(products.filter((p) => p.id !== id));
  };

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
            Products
          </Typography>

          <Button variant="contained" startIcon={<AddIcon />}>
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
  sx={{ width: 610 }}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <SearchIcon fontSize="small" />
      </InputAdornment>
    ),
    endAdornment: (
      <InputAdornment position="end">
        <Button
            variant="contained"
            sx={{
                backgroundColor: "#1F384C",
                color: "#fff",
                textTransform: "none", // keeps text normal case
                "&:hover": {
                backgroundColor: "#162A3F", // slightly darker on hover
                },
                height: "30px", // adjust height to match TextField
            }}
            onClick={() => {
                console.log("Search clicked:", search);
                // put your search function here
            }}
            >
            Search
            </Button>
        </InputAdornment>
        ),
    }}
    />

            <Button startIcon={<FilterListIcon />} variant="outlined">
              Filter
            </Button>

            <Button startIcon={<SortIcon />} variant="outlined">
              Sort asc
            </Button>

            <Button startIcon={<SortIcon />} variant="outlined">
              Sort desc
            </Button>
          </Stack>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#fafafa" }}>
              <TableRow>
                <TableCell><b>Image</b></TableCell>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell align="center"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    No products found
                  </TableCell>
                </TableRow>
              )}

              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Avatar src={product.image} variant="rounded" />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {product.name}
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>₱{product.price}</TableCell>
                  <TableCell align="center">
                        <Tooltip title="Edit">
                            <IconButton>
                            <EditIcon sx={{ 
                                fill: "#fff",       // fill white
                                stroke: "#000",     // outline black
                                strokeWidth: 1.5    // thickness of the outline
                            }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                            <IconButton>
                            <DeleteIcon sx={{ 
                                fill: "#fff",
                                stroke: "#000",
                                strokeWidth: 1.5
                            }} />
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
