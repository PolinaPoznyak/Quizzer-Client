import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import MuiAlert from '@mui/material/Alert';
import apiService from '../../services/apiService';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [newUsername, setNewUsername] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleDeleteUser = (userId, isDeleted) => {
    setSelectedUser(users.find((user) => user.id === userId));
    setOpenDeleteDialog(true);
  };

  const handleConfirmBlock = async () => {
    try {
      await apiService.blockUser({
        id: selectedUser.id,
        isDeleted: true,
      });

      fetchUsers();
      showSnackbar('User blocked successfully', 'success');
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error blocking user:', error);
      showSnackbar('Error blocking user', 'error');
      setOpenDeleteDialog(false);
    }
  };

  const handleConfirmUnblock = async () => {
    try {
      await apiService.blockUser({
        id: selectedUser.id,
        isDeleted: false,
      });

      fetchUsers();
      showSnackbar('User unblocked successfully', 'success');
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error('Error unblocking user:', error);
      showSnackbar('Error unblocking user', 'error');
      setOpenDeleteDialog(false);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    apiService.getUsers()
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUsername(user.username);
    setNewFullName(user.fullName || '');
    setNewProfilePicture(user.profilePicture || '');
    setOpenEditDialog(true);
  };

  const handleSaveChanges = () => {
    if (selectedUser.id) {
      const updatedUser = {
        ...selectedUser,
        username: newUsername,
        fullName: newFullName,
        profilePicture: newProfilePicture,
      };

      apiService.editUser(updatedUser)
        .then(() => {
          fetchUsers();
          showSnackbar('User updated successfully', 'success');
          setOpenEditDialog(false);
        })
        .catch(error => {
          console.error('Error updating user:', error);
          showSnackbar('Error updating user', 'error');
        });
    } else {
      handleRegisterUser();
    }
  };

  const handleRegisterUser = () => {
    const newUser = {
      id: uuidv4(),
      username: newUsername,
      password: newPassword,
      email: newEmail,
    };

    apiService.register(newUser)
      .then(() => {
        fetchUsers();
        showSnackbar('User added successfully', 'success');
        setOpenAddDialog(false);
      })
      .catch(error => {
        console.error('Error registering user:', error);
        showSnackbar('Error registering user', 'error');
      });
  };

  const handleAddUser = () => {
    setSelectedUser({});
    setNewUsername('');
    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
    setOpenAddDialog(true);
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const Alert = React.forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  return (
    <div>
      <h3>User Table</h3>
      <Button variant="contained" onClick={handleAddUser}>
        Add User
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Full Name</TableCell>
            <TableCell>Profile Picture</TableCell>
            <TableCell>Blocked</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email || '-'}</TableCell>
              <TableCell>{user.fullName || '-'}</TableCell>
              <TableCell>{user.profilePicture || '-'}</TableCell>
              <TableCell>
                {user.isDeleted ? (
                  <Typography variant="body2" sx={{ color: 'red' }}>
                    {user.isDeleted === true ? 'true' : 'blocked'}
                  </Typography>
                ) : (
                  'false'
                )}
              </TableCell>
              <TableCell>
                <Button onClick={() => handleEditUser(user)}>Edit</Button>
                <Button onClick={() => handleDeleteUser(user.id, user.isDeleted)}>
                  {user.isDeleted ? 'Unblock' : 'Block'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
            type="password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterUser} variant="contained">
            Add User
          </Button>
          <Button onClick={() => setOpenAddDialog(false)} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Full Name"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Profile Picture"
            value={newProfilePicture}
            onChange={(e) => setNewProfilePicture(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveChanges} variant="contained">
            Save Changes
          </Button>
          <Button onClick={() => setOpenEditDialog(false)} color="secondary" variant="contained">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>{selectedUser.isBlocked ? 'Confirm Unblock' : 'Confirm Block'}</DialogTitle>
        <DialogContent>
          <p>
            Are you sure you want to {selectedUser.isBlocked ? 'unblock' : 'block'} the user{' '}
            {selectedUser.username}?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary" variant="contained">
            Cancel
          </Button>
          <Button
            onClick={selectedUser.isDeleted ? handleConfirmUnblock : handleConfirmBlock}
            color="primary"
            variant="contained"
          >
            {selectedUser.isDeleted ? 'Confirm Unblock' : 'Confirm Block'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserTable;
