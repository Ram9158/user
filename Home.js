import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Modal,
  Typography,
  TextField,
  Stack,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useEffect } from "react";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 3,
};

const Home = () => {

  const [rows, setRows] = useState([]);
  const [formData, setFormData] = useState({ name: "", mobile: "", userName: "" });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [viewData, setViewData] = useState({ name: "", mobile: "", userName: "" });

  const [isEdit, setIsEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (event, name) => {
    setFormData({ ...formData, [name]: event.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.mobile) return;

    if (isEdit) {
      const updatedRows = [...rows];
      updatedRows[editIndex] = formData;
      setRows(updatedRows);
    } else {
      setRows([...rows, formData]);
    }

    setFormData({ name: "", mobile: "", userName: "" });
    setOpenAddModal(false);
    setIsEdit(false);
    setEditIndex(null);
  };

  const handleDelete = (indexToDelete) => {
    const updatedRows = rows.filter((_, index) => index !== indexToDelete);
    setRows(updatedRows);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://dummyjson.com/users");
        const users = response.data.users.map((user) => ({
          name: `${user.firstName} ${user.lastName}`,
          mobile: user.phone,
          userName: user.username,
        }));
        setRows(users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);


  const handleView = (row) => {
    setViewData(row);
    setOpenViewModal(true);
  };

  const handleEdit = (row, index) => {
    setFormData(row);
    setEditIndex(index);
    setIsEdit(true);
    setOpenAddModal(true);
  };

  return (
    <>
      <Typography variant="h4" fontWeight="bold" textAlign="center">
        User List
      </Typography>
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>

        <Button
          variant="contained"
          onClick={() => {
            setOpenAddModal(true);
            setFormData({ name: "", mobile: "" });
            setIsEdit(false);
          }}
        >
          Add User
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>UserName</strong></TableCell>
              <TableCell align="right"><strong>Mobile</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.userName}</TableCell>
                <TableCell align="right">{row.mobile}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleView(row)}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleEdit(row, index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">{isEdit ? "Edit User" : "Add User"}</Typography>
            <IconButton size="small" onClick={() => setOpenAddModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => handleInputChange(e, "name")}
              fullWidth
              size="small"
            />
            <TextField
              label="Mobile"
              value={formData.mobile}
              onChange={(e) => handleInputChange(e, "mobile")}
              fullWidth
              size="small"
            />
            <TextField
              label="User Name"
              value={formData.userName}
              onChange={(e) => handleInputChange(e, "userName")}
              fullWidth
              size="small"
            />
            <Button variant="contained" onClick={handleSubmit}>
              {isEdit ? "Update" : "Submit"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* View Modal */}
      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">View User</Typography>
            <IconButton size="small" onClick={() => setOpenViewModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={viewData.name}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Mobile"
              value={viewData.mobile}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="User Name"
              value={viewData.userName}
              fullWidth
              size="small"
              InputProps={{ readOnly: true }}
            />
            <Button variant="outlined" onClick={() => setOpenViewModal(false)}>
              Close
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default Home;
