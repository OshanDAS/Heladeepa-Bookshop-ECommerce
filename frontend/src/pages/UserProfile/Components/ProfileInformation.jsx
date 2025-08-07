import { useState, useEffect } from "react";
import { TextField, Button, Grid, Alert, CircularProgress, Box } from "@mui/material";
import axios from "axios";

const ProfileInformation = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("accessToken");
                const response = await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfile(response.data);
                setError("");
            } catch (err) {
                setError("Failed to load profile information. " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("accessToken");
            await axios.put("http://localhost:8080/api/profile", profile, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile. " + (err.response?.data?.message || err.message));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={profile.email}
                        disabled
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        helperText="Email cannot be changed"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={profile.phone || ""}
                        onChange={handleChange}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={profile.address || ""}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={3}
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={saving}
                        sx={{
                            bgcolor: "#8D6E63",
                            "&:hover": { bgcolor: "#5D4037" },
                            mt: 2,
                        }}
                    >
                        {saving ? <CircularProgress size={24} /> : "Save Changes"}
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default ProfileInformation;