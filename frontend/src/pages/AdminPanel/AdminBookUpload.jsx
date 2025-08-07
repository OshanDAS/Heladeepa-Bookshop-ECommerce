import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';

/**
 * @typedef {Object} Book
 * @property {string} name
 * @property {string} description
 * @property {string} imageUrl
 * @property {number} price
 * @property {number} stock
 * @property {string} author
 * @property {string} publisher
 * @property {string} category
 */

const AdminBookUpload = () => {
    const [file, setFile] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isValidFile, setIsValidFile] = useState(true); // Track file validity
    const [fileTypeError, setFileTypeError] = useState(false);
    const [hasDuplicate, setHasDuplicate] = useState(false); // Flag to track duplicates
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [validationErrors, setValidationErrors] = useState({});

    const fileInputRef = useRef(null);

    const onDrop = useCallback((acceptedFiles) => {
        const uploadedFile = acceptedFiles[0];

        // Check if file is valid
        if (!uploadedFile) {
            console.error('No file selected or file is undefined');
            return;  // Exit if no valid file
        }

        setFile(uploadedFile);
        setIsValidFile(true); // Reset validity on new file
        setHasDuplicate(false); // Reset duplicate flag
        parseFile(uploadedFile);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
            // Removed .docx from accepted file types (or you can add any other valid types if needed)
        },
        multiple: false,
        onDropRejected: (rejectedFiles) => {
            // This callback will be triggered for rejected file types
            const invalidFile = rejectedFiles[0];
            if (invalidFile) {
                setIsValidFile(false);
                setFileTypeError(true);
                toast.error('Unsupported file type. Please upload a CSV or Excel file.');
            }
        },
    });

    const parseFile = (file) => {
        if (!file || !file.name) {
            setIsValidFile(false);
            toast.error('Invalid file. Please select a valid file.');
            return;
        }

        const reader = new FileReader();
        const ext = file.name.split('.').pop().toLowerCase();
        setFileTypeError(false);

        reader.onload = (e) => {
            let data = [];
            let normalizedData = [];

            if (ext === 'csv') {
                const result = Papa.parse(e.target.result, {
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: (header) => header.trim().toLowerCase(),
                    transform: (value) => value.trim()
                });
                data = result.data;
            } else if (ext === 'xlsx' || ext === 'xls') {
                const workbook = XLSX.read(e.target.result, { type: 'binary' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                data = XLSX.utils.sheet_to_json(sheet);
            } else {
                setIsValidFile(false);
                setFileTypeError(true);
                toast.error('Unsupported file type. Please upload a CSV or Excel file.');
                return;
            }

            // Normalize headers and trim all values
            normalizedData = data
                .filter(row => Object.values(row).some(val => val?.toString().trim() !== '')) // Remove empty rows
                .map(row => {
                    const normalizedRow = {};
                    Object.keys(row).forEach(key => {
                        normalizedRow[key.toLowerCase()] = row[key]?.toString().trim();
                    });
                    return normalizedRow;
                });

            const requiredFields = ['name', 'description', 'price', 'stock', 'author', 'publisher', 'category'];
            const names = normalizedData.map(row => row.name?.toLowerCase()).filter(Boolean);
            const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

            if (duplicates.length > 0) {
                setIsValidFile(false);
                toast.error('Duplicate entries found. Please remove duplicates and try again.');
                return;
            }

            const invalidRows = normalizedData.filter((row, index) => {
                for (const field of requiredFields) {
                    if (!row[field] || row[field] === '') {
                        console.warn(`Row ${index + 1} missing field: ${field}`);
                        return true;
                    }
                }

                const price = parseFloat(row.price);
                const stock = parseInt(row.stock, 10);

                if (isNaN(price) || price <= 0) {
                    console.warn(`Row ${index + 1} has invalid price: ${row.price}`);
                    return true;
                }

                if (isNaN(stock) || stock < 0) {
                    console.warn(`Row ${index + 1} has invalid stock: ${row.stock}`);
                    return true;
                }

                return false;
            });

            if (invalidRows.length > 0) {
                setIsValidFile(false);
                toast.error('One or more rows have missing or invalid data. Please fix and re-upload.');
                return;
            }

            setIsValidFile(true);
            setPreviewData(normalizedData.slice(0, 5));
        };

        if (ext === 'csv') {
            reader.readAsText(file);
        } else {
            reader.readAsBinaryString(file);
        }
    };

    // Validation function to check for errors
    const validateEditForm = () => {
        let errors = {};
        // Validate required fields based on column fields (name, description, etc.)
        if (!editFormData.name || editFormData.name.trim() === '') {
            errors.name = 'Name is required';
        }
        if (!editFormData.author || editFormData.author.trim() === '') {
            errors.author = 'Author is required';
        }
        if (!editFormData.description || editFormData.description.trim() === '') {
            errors.description = 'Description is required';
        }
        if (!editFormData.price || isNaN(editFormData.price) || editFormData.price <= 0) {
            errors.price = 'Valid price is required';
        }
        if (!editFormData.stock || isNaN(editFormData.stock) || editFormData.stock < 0) {
            errors.stock = 'Valid stock value is required';
        }
        if (!editFormData.publisher || editFormData.publisher.trim() === '') {
            errors.publisher = 'Publisher is required';
        }
        if (!editFormData.category || editFormData.category.trim() === '') {
            errors.category = 'Category is required';
        }

        // Check for duplicates
        if (previewData.some((item) => item.name === editFormData.name && item !== previewData[editRowIndex])) {
            errors.name = 'This name already exists';
        }

        return errors;
    };




    const removeRow = (index) => {
        const updatedData = [...previewData];
        updatedData.splice(index, 1);
        setPreviewData(updatedData);
    };

    const handleEditClick = (index) => {
        // Set the row to edit and initialize editFormData
        setEditRowIndex(index);
        setEditFormData({ ...previewData[index] });
    };

    const handleEditChange = (e, key) => {
        // Update the form data as the user types
        setEditFormData((prevState) => ({
            ...prevState,
            [key]: e.target.value,
        }));
    };

    const handleEditSave = () => {
        const errors = validateEditForm(); // Validate the form data
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors); // Set the errors if validation fails
            return; // Don't submit if there are errors
        }

        // No errors, proceed with the update
        const updatedData = [...previewData];
        updatedData[editRowIndex] = editFormData;
        setPreviewData(updatedData);
        setEditRowIndex(null);  // Exit the edit mode
        setValidationErrors({}); // Clear any existing validation errors
    };




    const columns = useMemo(() => {
        const fieldKeys = ['name', 'description', 'price', 'stock', 'author', 'publisher', 'category'];

        return [
            ...fieldKeys.map((key) => ({
                header: key.charAt(0).toUpperCase() + key.slice(1),
                accessorKey: key,
                cell: ({ row, getValue }) => {
                    const value = getValue();
                    const index = row.index;

                    // Determine if there are validation errors for this field
                    const hasError = validationErrors[key];

                    return editRowIndex === index ? (
                        <input
                            value={editFormData[key]}
                            onChange={(e) => handleEditChange(e, key)}
                            className={`border p-1 w-full ${hasError ? 'border-red-500' : ''}`} // Apply red border if there's an error
                            autoFocus
                        />
                    ) : (
                        <span>{value}</span>
                    );
                },
            })),
            {
                header: 'Actions',
                cell: ({ row }) => {
                    const index = row.index;
                    return (
                        <div className="flex space-x-2">
                            {editRowIndex === index ? (
                                <button
                                    onClick={handleEditSave}
                                    className="text-green-600 hover:underline"
                                >
                                    Save
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleEditClick(index)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Edit
                                </button>
                            )}
                            <button
                                onClick={() => removeRow(index)}
                                className="text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    );
                },
            },
        ];
    }, [editRowIndex, editFormData, previewData]);

    const table = useReactTable({
        data: previewData,
        columns,
        state: { globalFilter: searchQuery },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });


    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return;
        }

        if (!isValidFile) {
            toast.error('Please fix the file errors before uploading.');
            return;
        }

        if (fileTypeError) {
            toast.error('Upload failed. Please check the file format and try again.');
            return;
        }

        if (hasDuplicate) {
            toast.error('Please remove duplicate entries before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            setProgress(0);

            // Make the API call to upload the file
            await axios.post('http://localhost:8080/api/upload/books', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                },
                onUploadProgress: (event) => {
                    const percent = Math.round((event.loaded * 100) / event.total);
                    setProgress(percent);
                },
            });

            // Show success message and toast notification
            toast.success('Upload successful!');
            setFile(null);
            setPreviewData([]);
            setFile(null);

            // Reset file input element
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Upload error:', error);

            if (error.response) {
                const message =
                    error.response.data?.message ||
                    error.response.data?.error ||
                    JSON.stringify(error.response.data);

                toast.error(message || 'Upload failed.');
            } else {
                toast.error('Upload failed. Please check the file format and try again.');
            }
        } finally {
            setUploading(false); // Reset the uploading state
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-center">📚 Bulk Booklist Upload</h2>

            <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl px-6 py-12 cursor-pointer transition ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="w-12 h-12 text-gray-500" />
                <p className="text-gray-600 mt-4">
                    {isDragActive ? 'Drop the file here ...' : 'Drag & drop your CSV/Excel file here, or click to browse'}
                </p>
                {file && <p className="mt-2 text-sm text-gray-700">📄 {file.name}</p>}
            </div>

            {previewData.length > 0 && (
                <>
                    <input
                        className="w-full mb-3 p-2 border rounded"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-sm text-left border">
                            <thead className="bg-gray-200">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id} className="px-2 py-1 border cursor-pointer" onClick={header.column.getToggleSortingHandler()}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getIsSorted() ? (header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽') : ''}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                            </thead>
                            <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-2 py-1 border">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            <button
                className="mt-6 w-full py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:bg-gray-400"
                onClick={handleUpload}
                disabled={uploading || !file || !isValidFile || hasDuplicate}
            >
                {uploading ? 'Uploading...' : 'Upload Booklist'}
            </button>

            {uploading && (
                <div className="mt-4 h-3 rounded bg-gray-200 overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            )}
        </div>
    );
};

export default AdminBookUpload;