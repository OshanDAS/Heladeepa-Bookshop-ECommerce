import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import { toast } from 'react-toastify';

const STATUS_OPTIONS = ['PENDING', 'SUBMITTED', 'IN_REVIEW', 'COMPLETED'];

const AdminBooklistPanel = () => {
  const [booklists, setBooklists] = useState([]);

  useEffect(() => {
    fetchAllBooklists();
  }, []);

  const fetchAllBooklists = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/booklists/admin/all', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setBooklists(response.data);
    } catch (error) {
      toast.error('Error fetching booklists');
    }
  };

  const handleStatusChange = async (booklistId, newStatus) => {
    try {
      await axios.put(
          `http://localhost:8080/api/booklists/admin/status/${booklistId}?status=${newStatus}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
      );
      fetchAllBooklists();
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Error updating status');
    }
  };

  return (
      <Box sx={{ p: 3, bgcolor: '#E1E8EE', minHeight: '100vh' }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'white', borderRadius: 2, border: '1px solid #3E2723' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ color: '#6D4C41', fontWeight: 'bold' }}>
              Admin Booklist Management
            </Typography>
          </Box>

          {booklists.length === 0 ? (
              <Typography variant="body1" sx={{ color: '#6D4C41', textAlign: 'center', py: 4 }}>
                No booklists available.
              </Typography>
          ) : (
              <Grid container spacing={3}>
                {booklists.map((booklist) => (
                    <Grid item xs={12} md={6} key={booklist.id}>
                      <Card
                          elevation={2}
                          sx={{
                            minHeight: 400,
                            maxHeight: 400,
                            borderRadius: 2,
                            border: '1px solid #D7CCC8',
                            maxWidth: 350,
                            minWidth: 350,
                          }}
                      >
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" component="h2" sx={{ color: '#5D4037' }}>
                              {booklist.name}
                            </Typography>
                            <Chip
                                label={booklist.status}
                                color={
                                  booklist.status === 'PENDING'
                                      ? 'warning'
                                      : booklist.status === 'COMPLETED'
                                          ? 'success'
                                          : 'default'
                                }
                                size="small"
                                sx={{
                                  bgcolor:
                                      booklist.status === 'PENDING'
                                          ? '#F5DEB3'
                                          : booklist.status === 'COMPLETED'
                                              ? '#D7CCC8'
                                              : booklist.status === 'SUBMITTED'
                                                  ? '#BCAAA4'
                                                  : '#A1887F',
                                  color: '#3E2723',
                                }}
                            />
                          </Box>

                          <Typography variant="body2" sx={{ color: '#8D6E63', mb: 2 }}>
                            Customer: {booklist.customerEmail}
                          </Typography>

                          <List dense sx={{ maxHeight: 200, overflowY: 'auto', flexGrow: 1 }}>
                            {booklist.books.map((book, index) => (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                  <ListItemText
                                      primary={`${book.title} (x${book.quantity})`}
                                      sx={{
                                        '& .MuiListItemText-primary': {
                                          fontSize: '0.9rem',
                                          color: '#5D4037',
                                        },
                                      }}
                                  />
                                </ListItem>
                            ))}
                          </List>

                          <Divider sx={{ my: 2, borderColor: '#D7CCC8' }} />

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ color: '#8D6E63' }}>
                              Submitted: {new Date(booklist.submittedDate).toLocaleDateString()}
                            </Typography>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <InputLabel sx={{ color: '#6D4C41' }}>Status</InputLabel>
                              <Select
                                  value={booklist.status}
                                  label="Status"
                                  onChange={(e) => handleStatusChange(booklist.id, e.target.value)}
                                  sx={{
                                    color: '#5D4037',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#8D6E63',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#5D4037',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                      borderColor: '#5D4037',
                                    },
                                  }}
                              >
                                {STATUS_OPTIONS.map((status) => (
                                    <MenuItem key={status} value={status}>
                                      {status}
                                    </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                ))}
              </Grid>
          )}
        </Paper>
      </Box>
  );
};

export default AdminBooklistPanel;