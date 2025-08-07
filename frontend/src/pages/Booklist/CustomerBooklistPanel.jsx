import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Grid,
  Chip,
  Paper,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import { toast } from 'react-toastify';

const CustomerBooklistPanel = () => {
  const [booklists, setBooklists] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentBooklist, setCurrentBooklist] = useState(null);
  const [newBooklist, setNewBooklist] = useState({ name: '', books: [{ title: '', quantity: 1 }] });
  const [customerEmail, setCustomerEmail] = useState('');
  const [methodDialogOpen, setMethodDialogOpen] = useState(false);
  const [ocrDialogOpen, setOcrDialogOpen] = useState(false);
  const [ocrBooklistName, setOcrBooklistName] = useState('');
  const [ocrImage, setOcrImage] = useState(null);

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [selectedBooklist, setSelectedBooklist] = useState(null);

  const [isUploading, setIsUploading] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setCustomerEmail(decoded.sub);
        fetchBooklists(decoded.sub);
      } catch (error) {
        toast.error('Error decoding token');
      }
    }
  }, []);

  const fetchBooklists = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/booklists/my/${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      setBooklists(response.data);
    } catch (error) {
      toast.error('Error fetching booklists');
    }
  };

  const handleAddBooklist = async () => {
    try {
      await axios.post('http://localhost:8080/api/booklists/add', 
        {
          ...newBooklist,
          customerEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setOpenDialog(false);
      setNewBooklist({ name: '', books: [''] });
      fetchBooklists(customerEmail);
      toast.success('Booklist added successfully');
    } catch (error) {
      toast.error('Error adding booklist');
    }
  };

  const handleOcrUpload = async () => {
    if (!ocrImage || !ocrBooklistName) {
      toast.error('Please provide both a name and an image');
      return;
    }

    setIsUploading(true);

    const token = localStorage.getItem('accessToken');
    let email;
    try {
      email = jwtDecode(token).sub;
    } catch (error) {
      toast.error('Invalid token');
      setIsUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', ocrImage);
    formData.append('email', email);
    formData.append('name', ocrBooklistName);

    try {
      const response = await axios.post(
          'http://localhost:8080/api/booklists/ocr-upload',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data', // Explicitly set for clarity
            },
          }
      );

      console.log('OCR Booklist Added:', response.data);
      toast.success('Booklist created successfully from image');
      setOcrDialogOpen(false);
      setOcrBooklistName('');
      setOcrImage(null);
      
      await fetchBooklists(email);
    } catch (error) {
      console.error('Error uploading and processing image:', error);
      toast.error(
          error.response?.data?.message || 'Error uploading and processing image'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
          `http://localhost:8080/api/booklists/upload-image/${id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
      );

      await fetchBooklists(customerEmail);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading image');
    }
  };


  const handleUpdateBooklist = async () => {
    try {
      await axios.put(`http://localhost:8080/api/booklists/update/${currentBooklist.id}`, 
        {
          name: currentBooklist.name,
          books: currentBooklist.books,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setOpenEditDialog(false);
      fetchBooklists(customerEmail);
      toast.success('Booklist updated successfully');
    } catch (error) {
      toast.error('Error updating booklist');
    }
  };

  const handleDeleteBooklist = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/booklists/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchBooklists(customerEmail);
      toast.success('Booklist deleted successfully');
    } catch (error) {
      toast.error('Error deleting booklist');
    }
  };

  const handleSubmitBooklist = async (id) => {
    try {
      await axios.post(`http://localhost:8080/api/booklists/submit/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      fetchBooklists(customerEmail);
      toast.success('Booklist submitted successfully');
    } catch (error) {
      toast.error('Error submitting booklist');
    }
  };

  const handleAddBookField = () => {
    setNewBooklist({ ...newBooklist, books: [...newBooklist.books, { title: '', quantity: 1 }] });
  };

  const handleBookChange = (index, field, value) => {
    const updatedBooks = [...newBooklist.books];
    updatedBooks[index] = {
      ...updatedBooks[index],
      [field]: field === 'quantity' ? parseInt(value) || 1 : value,
    };
    setNewBooklist({ ...newBooklist, books: updatedBooks });
  };


  const handleRemoveBookField = (index) => {
    const updatedBooks = newBooklist.books.filter((_, i) => i !== index);
    setNewBooklist({ ...newBooklist, books: updatedBooks });
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#E1E8EE', minHeight: '100vh' }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, bgcolor: 'white', borderRadius: 2, border: '1px solid #3E2723' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#6D4C41', fontWeight: 'bold' }}>
            My Booklists
          </Typography>
          {/*<Button*/}
          {/*  variant="contained"*/}
          {/*  startIcon={<AddIcon />}*/}
          {/*  onClick={() => setOpenDialog(true)}*/}
          {/*  sx={{*/}
          {/*    bgcolor: '#8D6E63',*/}
          {/*    '&:hover': { bgcolor: '#5D4037' },*/}
          {/*    borderRadius: 2,*/}
          {/*    px: 3,*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Add New Booklist*/}
          {/*</Button>*/}
          <Button onClick={() => setMethodDialogOpen(true)} variant="contained" sx={{ bgcolor: '#8D6E63' }}>
            Add New Booklist
          </Button>
        </Box>

        <Grid container spacing={3}>
          {booklists.map((booklist) => (
            <Grid item xs={12} md={6} key={booklist.id}>
              <Card elevation={2} sx={{minHeight:400,maxHeight:400 ,borderRadius: 2, border: '1px solid #D7CCC8',maxWidth:350,minWidth:350 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#5D4037' }}>
                      {booklist.name}
                    </Typography>
                    <Box>
                      <IconButton
                        onClick={() => {
                          if (booklist.imageUrl) {
                            setImagePreviewUrl(booklist.imageUrl);
                            setImagePreviewOpen(true);
                          }
                        }}
                        size="small"
                        sx={{ color: booklist.imageUrl ? '#8D6E63' : '#D7CCC8', mr: 1 }}
                      >
                        <ImageIcon />
                      </IconButton>
                      <IconButton
                          onClick={() => {
                          setCurrentBooklist(booklist);
                          setOpenEditDialog(true);
                        }}
                        size="small"
                        sx={{ color: '#8D6E63' }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteBooklist(booklist.id)}
                        size="small"
                        sx={{ color: '#5D4037' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Chip
                    label={booklist.status}
                    color={booklist.status === 'PENDING' ? 'warning' : 'success'}
                    size="small"
                    sx={{ mb: 2, bgcolor: booklist.status === 'PENDING' ? '#F5DEB3' : '#D7CCC8' }}
                  />

                  <List dense sx={{maxHeight:200, overflowY:'auto',flexGrow: 1}}>
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
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={() => handleSubmitBooklist(booklist.id)}
                      disabled={booklist.status !== 'PENDING'}
                      sx={{
                        bgcolor: '#8D6E63',
                        '&:hover': { bgcolor: '#5D4037' },
                        '&.Mui-disabled': { bgcolor: '#D7CCC8' },
                      }}
                    >
                      Submit
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Add Booklist Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#8D6E63', color: 'white' }}>Add New Booklist</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Booklist Name"
            value={newBooklist.name}
            onChange={(e) => setNewBooklist({ ...newBooklist, name: e.target.value })}
            margin="normal"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#8D6E63' },
                '&:hover fieldset': { borderColor: '#5D4037' },
                '&.Mui-focused fieldset': { borderColor: '#5D4037' },
              },
              '& .MuiInputLabel-root': { color: '#6D4C41' },
            }}
          />
          {newBooklist.books.map((book, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                    fullWidth
                    label={`Book ${index + 1} Title`}
                    value={book.title}
                    onChange={(e) => handleBookChange(index, 'title', e.target.value)}
                    variant="outlined"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#8D6E63' },
                        '&:hover fieldset': { borderColor: '#5D4037' },
                        '&.Mui-focused fieldset': { borderColor: '#5D4037' },
                      },
                      '& .MuiInputLabel-root': { color: '#6D4C41' },
                    }}
                />
                <TextField
                    label="Qty"
                    type="number"
                    value={book.quantity}
                    onChange={(e) => handleBookChange(index, 'quantity', e.target.value)}
                    sx={{ width: 100 }}
                    inputProps={{ min: 1 }}
                />
                {index > 0 && (
                    <IconButton onClick={() => handleRemoveBookField(index)} sx={{ color: '#5D4037' }}>
                      <DeleteIcon />
                    </IconButton>
                )}
              </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddBookField}
            sx={{ mt: 2, color: '#8D6E63' }}
          >
            Add Another Book
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#6D4C41' }}>Cancel</Button>
          <Button
            onClick={handleAddBooklist}
            variant="contained"
            sx={{ bgcolor: '#8D6E63', '&:hover': { bgcolor: '#5D4037' } }}
          >
            Add Booklist
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={methodDialogOpen} onClose={() => setMethodDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: '#8D6E63', color: 'white' }}>Select Method</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Button
              fullWidth
              variant="outlined"
              sx={{ mb: 2, color: '#6D4C41', borderColor: '#8D6E63' , mt:2}}
              onClick={() => {
                setMethodDialogOpen(false);
                setOpenDialog(true); // open default booklist dialog
              }}
          >
            Enter Manually
          </Button>
          <Button
              fullWidth
              variant="outlined"
              sx={{ color: '#6D4C41', borderColor: '#8D6E63' }}
              onClick={() => {
                setMethodDialogOpen(false);
                setOcrDialogOpen(true); // open OCR upload dialog
              }}
          >
            Upload Image (OCR)
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={ocrDialogOpen} onClose={() => setOcrDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#8D6E63', color: 'white', fontWeight: 'bold' }}>
          Upload Booklist Image
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 ,pt: 2}}>
            <TextField
                fullWidth
                label="Booklist Name"
                value={ocrBooklistName}
                onChange={(e) => setOcrBooklistName(e.target.value)}
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#8D6E63' },
                    '&:hover fieldset': { borderColor: '#5D4037' },
                    '&.Mui-focused fieldset': { borderColor: '#5D4037' },
                  },
                  '& .MuiInputLabel-root': { color: '#6D4C41' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#5D4037' },
                }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    borderColor: '#8D6E63',
                    color: '#6D4C41',
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: '#5D4037',
                      bgcolor: '#F5F5F5',
                    },
                  }}
              >
                Choose Image
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setOcrImage(e.target.files[0])}
                />
              </Button>
              <Typography
                  variant="body2"
                  sx={{
                    color: ocrImage ? '#5D4037' : '#8D6E63',
                    fontStyle: ocrImage ? 'normal' : 'italic',
                  }}
              >
                {ocrImage ? `Selected: ${ocrImage.name}` : 'No file selected'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, bgcolor: '#F5F5F5' }}>
          <Button
              onClick={() => setOcrDialogOpen(false)}
              sx={{
                color: '#6D4C41',
                textTransform: 'none',
                '&:hover': { bgcolor: '#EDE7E4' },
              }}
          >
            Cancel
          </Button>
          <Button
              onClick={handleOcrUpload}
              variant="contained"
              disabled={!ocrImage || !ocrBooklistName || isUploading}
              sx={{
                bgcolor: '#8D6E63',
                textTransform: 'none',
                '&:hover': { bgcolor: '#5D4037' },
                '&.Mui-disabled': { bgcolor: '#D7CCC8', color: '#FFFFFF' },
                borderRadius: 2,
              }}
              Stuart
              endIcon={<SendIcon />}
          >

            {isUploading ? 'Processing...' : 'Upload & Extract'}
          </Button>
        </DialogActions>
      </Dialog>


      {/* Edit Booklist Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#8D6E63', color: 'white' }}>Edit Booklist</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <input
                accept="image/*"
                style={{ display: 'none' }}
                id="booklist-image-upload"
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleImageUpload(currentBooklist.id, e.target.files[0]);
                  }
                }}
            />
            <label htmlFor="booklist-image-upload">
              <Button
                  component="span"
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  sx={{
                    color: '#8D6E63',
                    borderColor: '#8D6E63',
                    '&:hover': { borderColor: '#5D4037' },
                  }}
              >
                Upload Image
              </Button>
            </label>
          </Box>
          <TextField
            fullWidth
            label="Booklist Name"
            value={currentBooklist?.name || ''}
            onChange={(e) => setCurrentBooklist({ ...currentBooklist, name: e.target.value })}
            margin="normal"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#8D6E63' },
                '&:hover fieldset': { borderColor: '#5D4037' },
                '&.Mui-focused fieldset': { borderColor: '#5D4037' },
              },
              '& .MuiInputLabel-root': { color: '#6D4C41' },
            }}
          />
          {currentBooklist?.books.map((book, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mt: 2 }}>
                <TextField
                    fullWidth
                    label={`Book ${index + 1} Title`}
                    value={book.title}
                    onChange={(e) => {
                      const updatedBooks = [...currentBooklist.books];
                      updatedBooks[index] = { ...updatedBooks[index], title: e.target.value };
                      setCurrentBooklist({ ...currentBooklist, books: updatedBooks });
                    }}
                    variant="outlined"
                />
                <TextField
                    label="Qty"
                    type="number"
                    value={book.quantity}
                    onChange={(e) => {
                      const updatedBooks = [...currentBooklist.books];
                      updatedBooks[index] = {
                        ...updatedBooks[index],
                        quantity: parseInt(e.target.value) || 1,
                      };
                      setCurrentBooklist({ ...currentBooklist, books: updatedBooks });
                    }}
                    sx={{ width: 100 }}
                />
                {index > 0 && (
                    <IconButton
                        onClick={() => {
                          const updatedBooks = currentBooklist.books.filter((_, i) => i !== index);
                          setCurrentBooklist({ ...currentBooklist, books: updatedBooks });
                        }}
                        sx={{ color: '#5D4037' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                )}
              </Box>
          ))}

          <Button
            startIcon={<AddIcon />}
            onClick={() => {
              setCurrentBooklist({
                ...currentBooklist,
                books: [...currentBooklist.books, ''],
              });
            }}
            sx={{ mt: 2, color: '#8D6E63' }}
          >
            Add Another Book
          </Button>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEditDialog(false)} sx={{ color: '#6D4C41' }}>Cancel</Button>
          <Button
            onClick={handleUpdateBooklist}
            variant="contained"
            sx={{ bgcolor: '#8D6E63', '&:hover': { bgcolor: '#5D4037' } }}
          >
            Update Booklist
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
          open={imagePreviewOpen}
          onClose={() => setImagePreviewOpen(false)}
          maxWidth="md"
          fullWidth
      >
        <DialogTitle sx={{ bgcolor: '#8D6E63', color: 'white' }}>Booklist Image</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '100%', mt: 2 }}>
            <img
                src={imagePreviewUrl}
                alt="Booklist"
                style={{ width: '100%', height: 'auto', maxHeight: '70vh', objectFit: 'contain' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImagePreviewOpen(false)} sx={{ color: '#6D4C41' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerBooklistPanel;