import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, Box, Typography, Paper, Container, CircularProgress } from "@mui/material";
import ProfileInformation from "./components/ProfileInformation";
import PasswordChange from "./components/PasswordChange";

import axios from "axios";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`profile-tabpanel-${index}`}
            aria-labelledby={`profile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const UserProfile = () => {
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            navigate("/");
            return;
        }

        const checkAuth = async () => {
            try {
                await axios.get("http://localhost:8080/api/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAuthenticated(true);
            } catch (error) {
                console.error("Authentication error:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!authenticated) {
        return null;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: "#5D4037", fontWeight: "bold", mb: 3 }}>
                    My Profile
                </Typography>

                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="profile tabs"
                        sx={{
                            "& .MuiTab-root": {
                                color: "#8D6E63",
                                "&.Mui-selected": { color: "#5D4037", fontWeight: "bold" },
                            },
                            "& .MuiTabs-indicator": { backgroundColor: "#5D4037" },
                        }}
                    >
                        <Tab label="Personal Information" />
                        <Tab label="Change Password" />
                        {/*<Tab label="Order History" />*/}
                    </Tabs>
                </Box>

                <TabPanel value={value} index={0}>
                    <ProfileInformation />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <PasswordChange />
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default UserProfile;