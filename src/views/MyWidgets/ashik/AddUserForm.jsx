import React, { useEffect, useState } from 'react'
import PageContainer from 'src/components/container/PageContainer'
import ParentCard from 'src/components/shared/ParentCard'
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb'

import { useFormik } from 'formik';
import * as yup from 'yup';
import { Autocomplete, Box, Button, Grid, TextField } from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';
import LiveSwitch from './switch/LiveSwitch';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import Spinner from 'src/views/spinner/Spinner';
import axios from 'axios';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  // address: yup.string().required('Address is required'),
  profile: yup.mixed(),
  password: yup.string().min(8, 'Password should be of minimum 8 characters length'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),

});

export default function AddUserForm() {
  const [Cities, setcities] = useState([]); // Loading cities for fetching data
  const basic = "https://fullzapmor-api.vercel.app";
  const cbasic = "http://localhost:5000";
  const navigate = useNavigate();
  const {id} = useParams();
  const [loading,setLoading] = useState(false);

    const formik = useFormik({ 
        initialValues: {
            name: '',
            email: '',
            phone: '',
            dob:'',
            // address: '',
            city:'',
            profile: null,
            password: '',
            confirmPassword: '',
          },
        validationSchema: validationSchema,
        onSubmit: async(values) => {
          const formData = new FormData();
          formData.append('name', values.name);
          formData.append('email', values.email);
          formData.append('phone', values.phone);
          formData.append('dob', values.dob);
          formData.append('city', values.city);
          // formData.append('address', values.address);
          formData.append('profile', values.profile);
          formData.append('password', values.password);
          alert(formData)
          try {
          const url = id ? `${basic}/api/appusers/${id}`:`${basic}/api/appusers`;
          const method = id ? `PUT` : `POST`;
            const response = await fetch(url, {
              method: method,
              headers:{
                'Accept':'application/json'
              },
              body: formData, // Let the browser handle the multipart/form-data
            });
            if (!response.ok) {
              throw new Error('Failed to submit form');
            }
            const data = await response.json();
            console.log('Success:', data);
            // alert(id?`form updated successfully`:'Form submitted successfully!');
            Swal.fire({
              icon: 'success',
              title: id ? 'Service updated successfully!' : 'Form submitted successfully!',
              showConfirmButton: false,
              timer: 3000,  // Automatically close after 3 seconds
            });
            navigate(`/admin/user/all`);
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

     useEffect(() => {
    if (id) {
      setLoading(true); // Loading while fetching data
      fetch(`${basic}/api/appusers/${id}`)
        .then((response) => response.json())
        .then((data) =>{
          formik.setValues({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            dob: data.dob || '',
            city: data.city || '',
            // address: data.address || '',
            profile: data.profile || '',
            // password: data.password || '',
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]);

  //get cities
  useEffect(() => {
    // Fetch the service options from the API
    const fetchStateName = async () => {
        try {
            const response = await axios.get(`${basic}/api/cities/names`);
            setcities(response.data); // Assuming the data is an array of service objects
        } catch (error) {
            console.error('Error fetching StateName:', error);
        }
    };
    fetchStateName();
}, []);
  return (
    <PageContainer title="Service" description="this is Custom Form page">
        <Breadcrumb title={id ? 'Edit User' : 'Addd User'} subtitle="" />
        <ParentCard title={id ? 'Edit the following form':'Fill up the following form'}>
        {loading ? (
          <Spinner/>
        ) : (
           <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} mb={3}>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={12} lg={6}>
                            <CustomFormLabel>Name</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} >
                            <CustomFormLabel>Email</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} >
                            <CustomFormLabel>Phone</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>
                        {/* <Grid item xs={12} sm={12} lg={6} order={{ xs: 4, lg: 4 }}>
                            <CustomFormLabel>Address</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="address"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </Grid> */}
                        <Grid item xs={12} sm={12} lg={6}>
                          <CustomFormLabel>DOB</CustomFormLabel>
                          <CustomTextField
                              fullWidth
                              id="dob"
                              name="dob"
                              type="date"
                              variant="outlined"
                              value={formik.values.dob}
                              onChange={formik.handleChange}
                              error={formik.touched.dob && Boolean(formik.errors.dob)}
                              helperText={formik.touched.dob && formik.errors.dob}
                              InputLabelProps={{
                                  shrink: true,
                              }}
                          />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                          <CustomFormLabel>city</CustomFormLabel>
                          <Autocomplete
                            placeholder='Select a city'
                            disablePortal
                            id="city"
                            options={Cities} // Here, cityss = ['Doctors', 'Clinic']
                            // sx={{ width: 300 }}
                            lg={{width:300}}
                            value={formik.values.city}
                            onChange={(event, newValue) => {
                                formik.setFieldValue('city', newValue || '');
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                error={Boolean(formik.errors.city)}
                                helperText={formik.errors.city}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} >
                            <CustomFormLabel>Profile</CustomFormLabel>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                component="label"
                            >
                                Upload Profile Image
                                <input
                                type="file"
                                hidden
                                onChange={(event) => {
                                  const file = event.currentTarget.files[0];
                                  formik.setFieldValue('profile', file);
                                  if (file) {
                                    formik.setFieldValue('profilePreview', URL.createObjectURL(file)); // Set a preview URL
                                  }
                                }}
                                />
                            </Button>
                            {formik.values.profile && (
                              <Box sx={{ ml: 2 }}>
                                {typeof formik.values.profile === 'object' ? (
                                  // Display the preview of the uploaded image
                                  <img
                                    src={formik.values.profilePreview}
                                    alt="profile Preview"
                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                                  />
                                ) : (
                                  // Display the fetched profile if already available as a URL
                                  <img
                                    src={formik.values.profile}
                                    alt="profile Preview"
                                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                                  />
                                )}
                              </Box>
                            )}
                            </Box>
                            {formik.touched.profile && formik.errors.profile && (
                              <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.profile}</div>
                            )}
                        </Grid>
                        {!id && <Grid item xs={12} sm={12} lg={6}>
                            <CustomFormLabel>Password</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        </Grid>}
                        {!id && <Grid item xs={12} lg={6}>
                          <CustomFormLabel>Re-enter Password</CustomFormLabel>
                          <CustomTextField
                            placeholder="Re-enter your password"
                            fullWidth
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                          />
                        </Grid>}
                    </Grid>
                </Grid>
                <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Submitting...' : id ? 'Update' : 'Submit'}  {/* Dynamic button label */}
            </Button>
          </form>
        )}
        </ParentCard>
    </PageContainer>
  )
}
