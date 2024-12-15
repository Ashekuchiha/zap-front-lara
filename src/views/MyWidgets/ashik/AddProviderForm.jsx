import React, { useEffect, useState } from 'react'
import PageContainer from 'src/components/container/PageContainer'
import ParentCard from 'src/components/shared/ParentCard'
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb'

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete, Box, Button, Checkbox, FormHelperText, Grid, MenuItem, TextField } from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';
import LiveSwitch from './switch/LiveSwitch';
import MyCheckBox from './checkbox/MyCheckBox.jsx';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import Spinner from 'src/views/spinner/Spinner';
const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phoneNumber: Yup.string()
      .matches(/^[0-9]+$/, 'Phone Number must be only digits')
      .required('Phone Number is required'),
      password: Yup.string()
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    service: Yup.string().required('Service is required'),
    specialized: Yup.string().required('Specialized field is required'),
    experience: Yup.number()
      .integer('Experience must be a whole number')
      .positive('Experience must be a positive number')
      .required('Experience is required'),
    // serviceOrganization: Yup.string().required('Service Organization is required'),
    status: Yup.string().required('Status is required'),
  });


export default function AddProviderForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [services, setServices] = useState([]); // Loading services for fetching data
  const [servicesOrganization, setServicesOrganization] = useState([]); // Loading servicesOrganization for fetching data

  const Call =()=>{
      return(
          <>
          <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                  <CustomFormLabel>Amount</CustomFormLabel>
                  <CustomTextField
                  placeholder='Enter the amount'
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
                  placeholder='Select'
                  fullWidth
                  labelId="type-select"
                  id="type" 
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  >
                  <MenuItem value='percent' placeholder='select'>Percent</MenuItem>
                  <MenuItem value='flat'>Flat</MenuItem>
                  </CustomSelect>
                  {formik.errors.type && (
                      <FormHelperText error id="standard-weight-helper-text-email-login">
                          {' '}
                          {formik.errors.type}{' '}
                      </FormHelperText>
                  )}
              </Grid>
          </Grid>
          </>
      )
    }

  const basic = "https://fullzapmor-api.vercel.app";
  const cbasic = "http://localhost:5000";
  const navigate = useNavigate();
  const [switchs, setswitchs] = useState(false); 

  const formik = useFormik({
        initialValues : {
          name: '',
          email: '',
          phoneNumber: '',
          assistantName: '',
          assistantphoneNumber: '',

          password: '',
          confirmPassword: '',
          qualification: '',
          specialized: '',
          experience: '',

          service: '',
          serviceOrganization: [],
          organizationMobile: '',

          amount: '',
          type:'',

          status:'',
          featured: false,

          profileImage: null,       // For single file upload (not required)
          certificate: null,         // For multiple file uploads (not required)
        },          

      validationSchema: validationSchema,
      onSubmit: async (values) => {
          const formData = new FormData();
        
          // Append text and other basic fields
          formData.append('name', values.name);
          formData.append('email', values.email);
          formData.append('assistantName', values.assistantName);
          formData.append('assistantphoneNumber', values.assistantphoneNumber);
          formData.append('qualification', values.qualification);
          formData.append('phoneNumber', values.phoneNumber);
          formData.append('organizationMobile', values.organizationMobile);
          formData.append('password', values.password);
          formData.append('service', values.service);
          formData.append('specialized', values.specialized);
          formData.append('experience', values.experience);
          // formData.append('serviceOrganization', values.serviceOrganization);
          values.serviceOrganization.forEach((item) => {
            formData.append('serviceOrganization[]', item); // Append each item, you can also use a unique name like 'serviceOrganization' if you prefer
        });
          formData.append('profileImage', values.profileImage);
          formData.append('certificate', values.certificate);
          formData.append('status', values.status);
          formData.append('amount', values.amount);
          formData.append('type', values.type);
          formData.append('featured', values.featured);

          // <Alert severity="error">{JSON.stringify(values)}</Alert>
          console.log(JSON.stringify(values))
          try {
            const url = id
              ? `${basic}/api/services-providers/${id}`
              : `${basic}/api/services-providers`;
            const method = id ? 'PUT' : 'POST';

              const response = await fetch(url, {
                method: method,
                // headers:{
                //   'Accept':'application/json'
                // },
                body: formData, // Let the browser handle the multipart/form-data
              });
              if (!response.ok) {
                throw new Error('Failed to submit form');
              }
            
              const data = await response.json();
              console.log('Success:', data);
              Swal.fire({
                icon: 'success',
                title: id ? 'Service updated successfully!' : 'Form submitted successfully!',
                showConfirmButton: false,
                timer: 3000,  // Automatically close after 3 seconds
              });
              formik.resetForm(); 
              navigate(`/admin/providers/all`);
            } catch (error) {
              console.error('Error:', error);
              Swal.fire({
                icon: 'error',
                title: error,
                showConfirmButton: false,
                timer: 3000,  // Automatically close after 3 seconds
              });
            }
      },
    });
//edit
  useEffect(() => {
    if (id) {
      setLoading(true); // Loading while fetching data
      fetch(`${basic}/api/services-providers/${id}`)
        .then((response) => response.json())
        .then((data) => {
          formik.setValues({
            name: data.name || '',
            email: data.email || '',
            assistantName: data.assistantName || '',
            assistantphoneNumber: data.assistantphoneNumber || '',
            qualification: data.qualification || '',
            phoneNumber: data.phoneNumber || '',
            organizationMobile: data.organizationMobile || '',
            service: data.service || '',
            specialized: data.specialized || '',
            experience: data.experience || '', // Expecting [latitude, longitude]
            serviceOrganization: data.serviceOrganization || [],
            status: data.status || '',
            certificate: data.certificate || null,
            profileImage: data.profileImage || null,
            amount: data.amount || '',
            type: data.type || '', // For file uploads, initialize as null
            featured: data.featured || false,

            });        
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]);

//service fetch
  useEffect(() => {
    // Fetch the service options from the API
    const fetchStateName = async () => {
        try {
            const response = await axios.get(`${basic}/api/services/all`);
            setServices(response.data); // Assuming the data is an array of service objects
        } catch (error) {
            console.error('Error fetching StateName:', error);
        }
    };
    fetchStateName();
}, []);
//service organization fetch
useEffect(() => {
  // Fetch the service options from the API
  const fetchStateName = async () => {
      try {
          const response = await axios.get(`${basic}/api/service-organization/all`);
          setServicesOrganization(response.data); // Assuming the data is an array of service objects
      } catch (error) {
          console.error('Error fetching StateName:', error);
      }
  };
  fetchStateName();
}, []);
  const statuss = [
    { id: 1, name: "Active" },
    { id: 2, name: "Pending" },
    { id: 3, name: "Completed" },
    { id: 4, name: "Cancelled" },
    { id: 4, name: "Banned" },
  ];

  return (
    <PageContainer title="Service Providers" description="this is Custom Form page">
      <Breadcrumb title={id? 'Edit service providers':'Add service provider'} subtitle="" />
      <ParentCard title={id? 'Edit the following form':'Fill up the following form'}>
        {loading ?(
          <Spinner/>
        ):(
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} mb={3}>

              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Name</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter your name'
                  fullWidth
                  id="name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Email</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter your email'
                  fullWidth
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Phone Number</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter your phone number'
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Qualification</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter The Qualification'
                  fullWidth
                  id="qualification"
                  name="qualification"
                  value={formik.values.qualification}
                  onChange={formik.handleChange}
                  error={formik.touched.qualification && Boolean(formik.errors.qualification)}
                  helperText={formik.touched.qualification && formik.errors.qualification}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Assistant Name</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter The Name'
                  fullWidth
                  id="assistantName"
                  name="assistantName"
                  value={formik.values.assistantName}
                  onChange={formik.handleChange}
                  error={formik.touched.assistantName && Boolean(formik.errors.assistantName)}
                  helperText={formik.touched.assistantName && formik.errors.assistantName}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Assistant Phone Number</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter THe phone number'
                  fullWidth
                  id="assistantphoneNumber"
                  name="assistantphoneNumber"
                  value={formik.values.assistantphoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.assistantphoneNumber && Boolean(formik.errors.assistantphoneNumber)}
                  helperText={formik.touched.assistantphoneNumber && formik.errors.assistantphoneNumber}
              />
              </Grid>

              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Password</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter a strong password'
                  fullWidth
                  type="password"
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
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
              </Grid>

              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Expertise</CustomFormLabel>
              <CustomTextField
                  placeholder='What you good at'
                  fullWidth
                  id="specialized"
                  name="specialized"
                  value={formik.values.specialized}
                  onChange={formik.handleChange}
                  error={formik.touched.specialized && Boolean(formik.errors.specialized)}
                  helperText={formik.touched.specialized && formik.errors.specialized}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Experience</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter your experience'
                  fullWidth
                  id="experience"
                  name="experience"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  error={formik.touched.experience && Boolean(formik.errors.experience)}
                  helperText={formik.touched.experience && formik.errors.experience}
              />
              </Grid>

              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Service</CustomFormLabel>
              <Autocomplete
                placeholder='Select a service'
                disablePortal
                id="services"
                options={services} // Here, servicess = ['Doctors', 'Clinic']
                // sx={{ width: 300 }}
                lg={{width:300}}
                value={formik.values.service}
                onChange={(event, newValue) => {
                    formik.setFieldValue('service', newValue || '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(formik.errors.service)}
                    helperText={formik.errors.service}
                  />
                )}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Service Organization</CustomFormLabel>
              <Autocomplete
                multiple
                id="serviceOrganization"
                name="serviceOrganization"
                options={servicesOrganization} // Replace with your API response
                disableCloseOnSelect // Keep dropdown open after selecting an option
                getOptionLabel={(option) => option} // Adjust this based on how your options are structured
                value={formik.values.serviceOrganization || []} // Ensure it works with controlled input
                onChange={(event, newValue) => {
                    formik.setFieldValue('serviceOrganization', newValue);
                }}
                onBlur={() => formik.setFieldTouched('serviceOrganization', true)}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      checked={selected}
                      style={{ marginRight: 8 }}
                    />
                    {option}
                  </li>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={formik.touched.serviceOrganization && Boolean(formik.errors.serviceOrganization)}
                    helperText={formik.touched.serviceOrganization && formik.errors.serviceOrganization}
                  />
                )}
              />
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel> Organization Mobile</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter your Organization Mobile'
                  fullWidth
                  id="organizationMobile"
                  name="organizationMobile"
                  value={formik.values.organizationMobile}
                  onChange={formik.handleChange}
                  error={formik.touched.organizationMobile && Boolean(formik.errors.organizationMobile)}
                  helperText={formik.touched.organizationMobile && formik.errors.organizationMobile}
              />
              </Grid>

              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Profile Image</CustomFormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button component="label">
                Upload profileImage Image
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue('profileImage', file);
                    if (file) {
                      formik.setFieldValue('profileImagePreview', URL.createObjectURL(file)); // Set a preview URL
                    }
                  }}                />
              </Button>
              {formik.values.profileImage && (
                      <Box sx={{ ml: 2 }}>
                        {typeof formik.values.profileImage === 'object' ? (
                          // Display the preview of the uploaded image
                          <img
                            src={formik.values.profileImagePreview}
                            alt="profileImage Preview"
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                          />
                        ) : (
                          // Display the fetched profileImage if already available as a URL
                          <img
                            src={formik.values.profileImage}
                            alt="profileImage Preview"
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                          />
                        )}
                      </Box>
                    )}
            </Box>
            {formik.touched.profileImage && formik.errors.profileImage && (
              <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.profileImage}</div>
            )}
              </Grid>
              <Grid item xs={12} lg={6}>
              <CustomFormLabel>Cover Photo</CustomFormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Button component="label">
                Upload certificate Image
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    const file = event.currentTarget.files[0];
                    formik.setFieldValue('certificate', file);
                    if (file) {
                      formik.setFieldValue('certificatePreview', URL.createObjectURL(file)); // Set a preview URL
                    }
                  }}                />
              </Button>
              {formik.values.certificate && (
                <Box sx={{ ml: 2 }}>
                  {typeof formik.values.certificate === 'object' ? (
                    // Display the preview of the uploaded image
                    <img
                      src={formik.values.certificatePreview}
                      alt="certificate Preview"
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                    />
                  ) : (
                    // Display the fetched certificate if already available as a URL
                    <img
                      src={formik.values.certificate}
                      alt="certificate Preview"
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                    />
                  )}
                </Box>
                    )}
            </Box>
            {formik.touched.certificate && formik.errors.certificate && (
              <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.certificate}</div>
            )}
              </Grid>

              <Grid item xs={12} lg={12}>
              <CustomFormLabel>Individual Commission</CustomFormLabel>
              <LiveSwitch
              initialChecked={switchs}
              onSwitchChange={() => switchs ? setswitchs(false): setswitchs(true)}
              />
              {switchs ? <Call/> : <></>}
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

              <Grid item xs={12} sm={12} lg={6}>
                  <CustomFormLabel>Featured</CustomFormLabel>
                  <LiveSwitch
                    initialChecked={formik.values.featured}
                    onSwitchChange={(value) => formik.setFieldValue('featured', value)}
                  />
              </Grid>

            </Grid>
            <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Submitting...' : id ? 'Update' : 'Submit'}
            </Button>
          </form>
        )}  
      </ParentCard>
    </PageContainer>
  )
}
