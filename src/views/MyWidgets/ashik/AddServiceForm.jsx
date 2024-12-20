
import React, { useEffect, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Box, Button, FormHelperText, Grid, MenuItem } from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import LiveSwitch from './switch/LiveSwitch';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams and useNavigate
import CommissionSetup from './CommissionSetup';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import Swal from 'sweetalert2';
import Spinner from 'src/views/spinner/Spinner';

const validationSchema = yup.object({
  name: yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
  description: yup.string().min(2, 'Too Short!').max(500, 'Too Long!').required('required'),
});

export default function AddServiceForm() {
  // const basic = "https://fullzapmor-api.vercel.app";
  const basic = "http://127.0.0.1:8000";
  const cbasic = "http://localhost:5000";
  const navigate = useNavigate(); // Initialize useNavigate
  const { id } = useParams();  // Get id from URL (if available)
  const [loading, setLoading] = useState(false);  // Add loading state for fetching data

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      icon: null,
      featured: false,
      status:'Active',
      amount:'',
      type:"percent",
      bookingsFee:"",
      bookingType:"",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values)
      console.log(values.icon)
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('icon', values.icon);
      formData.append('featured', values.featured ? "1" : "0");
      formData.append('status', values.status);
      formData.append('amount', values.amount);
      formData.append('type', values.type);
      formData.append('bookingsFee', values.bookingsFee);
      formData.append('bookingType', values.bookingType);
      if(id){formData.append('_method','PUT')}
     try {
        const url = id
          ? `${basic}/api/services/${id}` // Update service if id exists
          : `${basic}/api/services`; // Add new service otherwise

        const method ='POST';  // Change method based on the presence of id
        const response = await fetch(url, {
          method: method,
          headers: {
            Accept: 'application/json',
          },
          body: formData, // Let the browser handle the multipart/form-data
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }

        const data = await response.json();
        console.log('Success:', data);
        // alert(id ? 'Service updated successfully!' : 'Form submitted successfully!');
        Swal.fire({
          icon: 'success',
          title: id ? 'Service updated successfully!' : 'Form submitted successfully!',
          showConfirmButton: false,
          timer: 3000,  // Automatically close after 3 seconds
        });
        formik.resetForm(); // Reset form after successful submission
        navigate(`/admin/services/all`);
      } catch (error) {
        console.error('Error:', error);
        // alert('Failed to submit the form.');
        Swal.fire({
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 3000,  // Automatically close after 3 seconds
        });
      }
    },
  });

  // Fetch existing data if there is an id in the URL
  useEffect(() => {
    if (id) {
      setLoading(true);  // Set loading state while fetching data
      fetch(`${basic}/api/services/${id}`)
        .then((response) => response.json())
        .then((data) => {

          formik.setValues({
            name: data.data.name || '',
            description: data.data.description || '',
            icon: data.data.icon,  // Assuming the icon is fetched as a URL, handling of this would depend on the API response
            featured: data.data.featured || false,
            status: data.data.status || '',
            amount: data.data.amount || '',
            type: data.data.type || '',
            bookingsFee: data.data.bookingsFee || '',
            bookingType: data.data.bookingType || '',
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]);  // Dependency on id to fetch data when it changes

  const statuss = [
    { id: 1, name: "Active" },
    { id: 2, name: "Pending" },
    { id: 3, name: "Completed" },
    { id: 4, name: "Cancelled" },
    { id: 4, name: "Banned" },
];
  return (
    <PageContainer title="Service" description="this is Custom Form page">
      <Breadcrumb title={id ? 'Edit Service' : 'Add Service'} subtitle="" />  {/* Dynamic title */}
      <ParentCard title={id ? 'Edit the Following Form' : 'Fill up the Following Form'}>
        {loading ? (
          // <div>Loading...</div>  
          <Spinner/>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} mb={3}>
              <Grid container spacing={2} mb={3}>
                <Grid item xs={12} sm={12} lg={6}>
                  <CustomFormLabel>Name</CustomFormLabel>
                  <CustomTextField
                    placeholder="Enter your service name" 
                    fullWidth
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={12} lg={6}>
                  <CustomFormLabel>Icon</CustomFormLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button component="label">
                      Upload Icon Image
                      <input
                        type="file"
                        hidden
                        onChange={(event) => formik.setFieldValue('icon', event.currentTarget.files[0])}
                      />
                    </Button>
                    {formik.values.icon && (
                      <Box sx={{ ml: 2 }}>{typeof formik.values.icon === 'object' ? (
                        formik.values.icon.name // Display the uploaded file name
                      ) : (
                        <a href={formik.values.icon} target="_blank" rel="noopener noreferrer">
                          {formik.values.icon.split('/').pop()} 
                        </a>
                      )}</Box>
                    )}
                  </Box>
                  {formik.touched.icon && formik.errors.icon && (
                    <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.icon}</div>
                  )}
                </Grid> */}
                <Grid item xs={12} sm={12} lg={6}>
                  <CustomFormLabel>Icon</CustomFormLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button component="label">
                      Upload Icon Image
                      <input
                        type="file"
                        hidden
                        accept="image/*" // Only accept image files
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue('icon', file);
                          if (file) {
                            formik.setFieldValue('iconPreview', URL.createObjectURL(file)); // Set a preview URL
                          }
                        }}
                      />
                    </Button>
                    {formik.values.icon && (
                      <Box sx={{ ml: 2 }}>
                        {typeof formik.values.icon === 'object' ? (
                          // Display the preview of the uploaded image
                          <img
                            src={formik.values.iconPreview}
                            alt="Icon Preview"
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                          />
                        ) : (
                          // Display the fetched icon if already available as a URL
                          <img
                            src={formik.values.icon}
                            alt="Icon Preview"
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                          />
                        )}
                      </Box>
                    )}
                  </Box>
                  {formik.touched.icon && formik.errors.icon && (
                    <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.icon}</div>
                  )}
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                  <CustomFormLabel>Featured</CustomFormLabel>
                  <LiveSwitch
                    initialChecked={formik.values.featured}
                    onSwitchChange={(value) => formik.setFieldValue('featured', value)}
                  />
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                  <CustomFormLabel>Status</CustomFormLabel>
                  <CustomSelect
                    labelId="status-select"
                    fullWidth
                    id="status" 
                    name="status"
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    >
                       {statuss.map(status => (
                    <MenuItem key={status.id} value={status.name}>
                        {status.name}
                    </MenuItem>
                ))}
                    </CustomSelect>
                    {formik.errors.status && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                            {' '}
                            {formik.errors.status}{' '}
                        </FormHelperText>
                    )}
                </Grid>
                {/* <Grid item xs={12} sm={12} lg={6}>
                            <CustomFormLabel>Amount</CustomFormLabel>
                            <CustomTextField
                            fullWidth
                            id="amount"
                            name="amount"
                            value={formik.values.amount}
                            onChange={formik.handleChange}
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                            />
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                    <CustomFormLabel>Type</CustomFormLabel>
                    <CustomSelect
                    // style={{ width: '50%' }} 
                    fullWidth
                    labelId="gender-select"
                    id="type" 
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    >
                    <MenuItem value='percent'>Percent</MenuItem>
                    <MenuItem value='flat'>Flat</MenuItem>
                    </CustomSelect>
                    {formik.errors.type && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                            {' '}
                            {formik.errors.type}{' '}
                        </FormHelperText>
                    )}
                </Grid> */}
                <Grid item container spacing={2}>
                  <Grid item xs={8} sm={6} lg={6}>
                      <CustomFormLabel>Amount</CustomFormLabel>
                      <CustomTextField
                          fullWidth
                          id="amount"
                          name="amount"
                          value={formik.values.amount}
                          onChange={formik.handleChange}
                          error={formik.touched.amount && Boolean(formik.errors.amount)}
                          helperText={formik.touched.amount && formik.errors.amount}
                      />
                  </Grid>
                  <Grid item xs={4} sm={6} lg={6}>
                      <CustomFormLabel>Type</CustomFormLabel>
                      <CustomSelect
                          fullWidth
                          labelId="gender-select"
                          id="type"
                          name="type"
                          value={formik.values.type}
                          onChange={formik.handleChange}
                      >
                          <MenuItem value='percent'>Percent</MenuItem>
                          <MenuItem value='flat'>Flat</MenuItem>
                      </CustomSelect>
                      {formik.errors.type && (
                          <FormHelperText error id="standard-weight-helper-text-email-login">
                              {formik.errors.type}
                          </FormHelperText>
                      )}
                  </Grid>
                </Grid>
                <Grid item container spacing={2}>
                  <Grid item xs={8} sm={6} lg={6}>
                      <CustomFormLabel>Bookings Fee</CustomFormLabel>
                      <CustomTextField
                          fullWidth
                          id="bookingsFee"
                          name="bookingsFee"
                          value={formik.values.bookingsFee}
                          onChange={formik.handleChange}
                          error={formik.touched.bookingsFee && Boolean(formik.errors.bookingsFee)}
                          helperText={formik.touched.bookingsFee && formik.errors.bookingsFee}
                      />
                  </Grid>
                  <Grid item xs={4} sm={6} lg={6}>
                      <CustomFormLabel>Type</CustomFormLabel>
                      <CustomSelect
                          fullWidth
                          labelId="gender-select"
                          id="bookingType"
                          name="bookingType"
                          value={formik.values.bookingType}
                          onChange={formik.handleChange}
                      >
                          <MenuItem value='EURO'>EURO</MenuItem>
                          <MenuItem value='INR'>INR</MenuItem>
                          <MenuItem value='TK'>TK</MenuItem>
                      </CustomSelect>
                      {formik.errors.bookingType && (
                          <FormHelperText error id="standard-weight-helper-text-email-login">
                              {formik.errors.bookingType}
                          </FormHelperText>
                      )}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12} lg={12}>
                  <CustomFormLabel>Description</CustomFormLabel>
                  <CustomTextField
                    fullWidth
                    id="description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Submitting...' : id ? 'Update' : 'Submit'}  {/* Dynamic button label */}
            </Button>
          </form>
        )}
      </ParentCard>
    </PageContainer>
  );
}
