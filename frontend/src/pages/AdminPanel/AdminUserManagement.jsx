import { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Avatar,
    Tooltip,
    Paper,
    Grid,
    useTheme,
    alpha,
    InputAdornment,
} from "@mui/material";
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    LocationOn as LocationOnIcon,
    AdminPanelSettings as AdminIcon,
    SupportAgent as StaffIcon,
    PersonOutline as CustomerIcon,
    Search as SearchIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const roles = ["ADMIN", "STAFF", "CUSTOMER"];

const roleIcons = {
    ADMIN: <AdminIcon />,
    STAFF: <StaffIcon />,
    CUSTOMER: <CustomerIcon />,
};

const roleColors = {
    ADMIN: "#f44336",
    STAFF: "#2196f3",
    CUSTOMER: "#4caf50",
};

export default function AdminUserManagement() {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "CUSTOMER",
        phone: "",
        address: "",
    });
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8080/api/admin/users", {
                headers: authHeader(),
            });
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleCreate = async () => {
        try {
            await axios.post("http://localhost:8080/api/admin/users", newUser, {
                headers: authHeader(),
            });
            fetchUsers();
            setNewUser({ name: "", email: "", role: "CUSTOMER", phone: "", address: "" });
        } catch (error) {
            console.error("Error creating user:", error);
        }
    };

    const handleUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:8080/api/admin/users/${editingUser.id}`,
                editingUser,
                { headers: authHeader() }
            );
            fetchUsers();
            setEditingUser(null);
            toast.success("User updated successfully");
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error("Failed to update user");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/users/${id}`, {
                    headers: authHeader(),
                });
                fetchUsers();
                toast.success("User deleted successfully");
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user");
            }
        }
    };

    const UserCard = ({ user }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card
                sx={{
                    mb: 2,
                    transition: "transform 0.2s",
                    position: "relative",
                    "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: theme.shadows[4],
                    },
                }}
            >
                <CardContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar
                                sx={{
                                    bgcolor: alpha(roleColors[user.role], 0.2),
                                    color: roleColors[user.role],
                                }}
                            >
                                {roleIcons[user.role]}
                            </Avatar>
                        </Grid>
                        <Grid item xs>
                            <Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <Typography variant="h6">{user.username}</Typography>
                                    <Chip
                                        label={user.role}
                                        size="small"
                                        sx={{
                                            bgcolor: alpha(roleColors[user.role], 0.1),
                                            color: roleColors[user.role],
                                        }}
                                    />
                                </Box>
                                <Box display="flex" alignItems="center" gap={1} mt={1}>
                                    <EmailIcon fontSize="small" color="action" />
                                    <Typography variant="body2" color="text.secondary">
                                        {user.email}
                                    </Typography>
                                </Box>
                                {user.phone && (
                                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                        <PhoneIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {user.phone}
                                        </Typography>
                                    </Box>
                                )}
                                {user.address && (
                                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                                        <LocationOnIcon fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {user.address}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Grid>
                    </Grid>
                    <Box
                        sx={{
                            position: "absolute",
                            right: 16,
                            top: "50%",
                            transform: "translateY(-50%)",
                            display: "flex",
                            gap: 1,
                        }}
                    >
                        <Tooltip title="Edit User">
                            <IconButton
                                onClick={() => setEditingUser(user)}
                                color="primary"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    },
                                }}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                            <IconButton
                                onClick={() => handleDelete(user.id)}
                                color="error"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    },
                                }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardContent>
            </Card>
        </motion.div>
    );

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    mb: 4,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                }}
            >
                <Typography variant="h4" gutterBottom>
                    User Management
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Manage user accounts, roles, and permissions
                </Typography>
                
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search users by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: 'white',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <Box sx={{ display: "grid", gap: 2 }}>
                {filteredUsers.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}
                {filteredUsers.length === 0 && (
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            {searchQuery ? 'No users found matching your search' : 'No users found'}
                        </Typography>
                    </Paper>
                )}
            </Box>

            <Dialog
                open={Boolean(editingUser)}
                onClose={() => setEditingUser(null)}
                maxWidth="sm"
                fullWidth
            >
                {editingUser && (
                    <>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogContent>
                            <Box sx={{ display: "grid", gap: 2, pt: 2 }}>
                                <TextField
                                    label="Username"
                                    value={editingUser.username}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            username: e.target.value,
                                        })
                                    }
                                    fullWidth
                                />
                                <TextField
                                    label="Phone"
                                    value={editingUser.phone || ''}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            phone: e.target.value,
                                        })
                                    }
                                    fullWidth
                                />
                                <TextField
                                    label="Address"
                                    value={editingUser.address || ''}
                                    onChange={(e) =>
                                        setEditingUser({
                                            ...editingUser,
                                            address: e.target.value,
                                        })
                                    }
                                    fullWidth
                                    multiline
                                    rows={2}
                                />
                                <FormControl fullWidth>
                                    <InputLabel>Role</InputLabel>
                                    <Select
                                        value={editingUser.role}
                                        label="Role"
                                        onChange={(e) =>
                                            setEditingUser({
                                                ...editingUser,
                                                role: e.target.value,
                                            })
                                        }
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role} value={role}>
                                                {role}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setEditingUser(null)}
                                color="inherit"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdate}
                                variant="contained"
                                color="primary"
                            >
                                Save Changes
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}

function authHeader() {
    const token = localStorage.getItem("accessToken");
    return { Authorization: `Bearer ${token}` };
}