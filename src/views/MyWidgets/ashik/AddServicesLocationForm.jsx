import React, { useEffect, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Alert, Box, Button, FormHelperText, Grid, MenuItem } from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import LocationInput from './locationInput/LocationInput';
import { useNavigate, useParams } from 'react-router';
import { values } from 'lodash';
import axios from 'axios';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import LiveSwitch from './switch/LiveSwitch';
import Swal from 'sweetalert2';
import Spinner from 'src/views/spinner/Spinner';

// Validation schema using Yup
const validationSchema = yup.object({
  organizationName: yup.string(),
  ownerName: yup.string(),
  state: yup.string(),
  city: yup.string(),
  address: yup.string(),
  organizationBio: yup.string(),
  organizationDescription: yup.string(),
  organizationWebsite: yup.string(),
  phoneNumber: yup.string().matches(/^[0-9]+$/, 'Phone Number must be only digits'),  
  employeeNumbers: yup.number().integer('Employee Numbers must be an integer').positive('Employee Numbers must be a positive number')
,});

export default function AddServicesLocationForm() {
  const basic = "https://fullzapmor-api.vercel.app";
  const cbasic = "http://localhost:5000";
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false); // Loading state for fetching data
  const [StateNames, setStateNames] = useState([]);
  const [CityNames, setCityNames] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  const formik = useFormik({
    initialValues: {
      organizationName: '',
      ownerName: '',
      state: '',
      city: '',
      address: '',
      mapSelection: [], // Expecting [latitude, longitude]
      organizationBio: '',
      organizationDescription: '',
      organizationWebsite: '',
      phoneNumber: '',
      emergencyPhoneNumber: '',
      employeeNumbers: '',
      organizationLogo: null, // For file uploads, initialize as null
      organizationBanner: null, // For file uploads, initialize as null
      tradeLicense: null, // For file uploads, initialize as null
      organizationDocuments: null, // For multiple file uploads, initialize as an empty array
      featured:false,
    },
    
    // validationSchema: validationSchema,

    onSubmit: async (values) => {
      const formData = new FormData();
      
      // Append each field to the FormData
      formData.append('organizationName', values.organizationName);
      formData.append('ownerName', values.ownerName);
      formData.append('state', values.state);
      formData.append('city', values.city);
      formData.append('address', values.address);
    
      // Append arrays like mapSelection by converting them to JSON
      formData.append('mapSelection', JSON.stringify(values.mapSelection));
    
      formData.append('organizationBio', values.organizationBio);
      formData.append('organizationDescription', values.organizationDescription);
      formData.append('organizationWebsite', values.organizationWebsite);
      formData.append('phoneNumber', values.phoneNumber);
      formData.append('emergencyPhoneNumber', values.emergencyPhoneNumber);
      formData.append('employeeNumbers', values.employeeNumbers);
      formData.append('organizationLogo', values.organizationLogo);
      formData.append('organizationBanner', values.organizationBanner);
      formData.append('tradeLicense', values.tradeLicense);
      formData.append('organizationDocuments', values.organizationDocuments);
      formData.append('featured', values.featured);

      // alert(JSON.stringify(values),)
      console.log(JSON.stringify(values))
      try {
        const url = id
          ? `${basic}/api/service-organization/${id}`
          : `${basic}/api/service-organization`;
        const method = id ? 'PUT' : 'POST';
    
        // Send FormData without manually setting headers
        const response = await fetch(url, {
          method: method,
          body: formData,
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
        navigate(`/admin/serviceslocation/all`);
      } catch (error) {
        console.error('Error:', error);
        // alert(id?'Faild to update the form':'Failed to submit the form.');
        // <Alert>{id?'Faild to update the form':'Failed to submit the form.'}</Alert>
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
      fetch(`${basic}/api/service-organization/${id}`)
        .then((response) => response.json())
        .then((data) => {
          formik.setValues({
            organizationName: data.data.organizationName || '',
            ownerName: data.data.ownerName || '',
            state: data.data.state || '',
            city: data.data.city || '',
            address: data.data.address || '',
            mapSelection: data.data.mapSelection || [], // Expecting [latitude, longitude]
            organizationBio: data.data.organizationBio || '',
            organizationDescription: data.data.organizationDescription || '',
            organizationWebsite: data.data.organizationWebsite || '',
            phoneNumber: data.data.phoneNumber || '',
            emergencyPhoneNumber: data.data.emergencyPhoneNumber || '',
            employeeNumbers: data.data.employeeNumbers || '',
            organizationLogo: data.data.organizationLogo || null, // For file uploads, initialize as null
            organizationBanner: data.data.organizationBanner || null, // For file uploads, initialize as null
            tradeLicense: data.data.tradeLicense || null, // For file uploads, initialize as null
            organizationDocuments: data.data.organizationDocuments || null, // For multiple file uploads, initialize as an empty array
            featured: data.data.featured || false,
        });        
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]); // Fetch data on mount if there's an ID

  //state
  useEffect(() => {
    // Fetch the service options from the API
    const fetchStateName = async () => {
        try {
            const response = await axios.get(`${basic}/api/states/all`);
            setStateNames(response.data.data.data); // Assuming the data is an array of service objects
            console.log(response)
        } catch (error) {
            console.error('Error fetching StateName:', error);
        }
    };

    fetchStateName();
}, []);

  //city
  useEffect(() => {
    // Fetch the service options from the API
    const fetchStateName = async () => {
        try {
            const response = await axios.get(`${basic}/api/cities/${selectedState?selectedState:'all'}`);
            setCityNames(response.data.data.data); // Assuming the data is an array of service objects
            console.log(response)
            console.log(response.data)
            console.log(response.data.data)
            console.log(response.data.data.data)
        } catch (error) {
            console.error('Error fetching StateName:', error);
        }
    };

    fetchStateName();
}, [selectedState]);

const handleStateChange = (event) => {
  const newValue = event.target.value;
  formik.setFieldValue('state', newValue);
  setSelectedState(newValue); // Update selectedState variable
};

console.log(selectedState)
  return (
    <PageContainer title="Service organization" description="This is the Custom Form page">
      <Breadcrumb title={id ? 'Edit service organization' : 'Add service organization'} subtitle="" />
      <ParentCard title={id ? 'Edit the Following Form' : 'Fill up the Following Form'}>
        {loading ? (
          <Spinner/>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Organization Name</CustomFormLabel>
                <CustomTextField
                placeholder='Enter the organization name'
                  fullWidth
                  id="organizationName"
                  name="organizationName"
                  value={formik.values.organizationName}
                  onChange={formik.handleChange}
                  error={formik.touched.organizationName && Boolean(formik.errors.organizationName)}
                  helperText={formik.touched.organizationName && formik.errors.organizationName}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Organization Website (optional)</CustomFormLabel>
                <CustomTextField
                placeholder='Enter your Organization Website'
                  fullWidth
                  id="organizationWebsite"
                  name="organizationWebsite"
                  value={formik.values.organizationWebsite}
                  onChange={formik.handleChange}
                  error={formik.touched.organizationWebsite && Boolean(formik.errors.organizationWebsite)}
                  helperText={formik.touched.organizationWebsite && formik.errors.organizationWebsite}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Organization Logo</CustomFormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button component="label">
                      Upload organizationLogo Image
                      <input
                        type="file"
                        hidden
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue('organizationLogo',file);
                          if(file){
                            formik.setFieldValue('organizationLogoPreview',URL.createObjectURL(file));
                          }
                        }}
                      />
                    </Button>
                    {formik.values.organizationLogo && (
                      <Box sx={{ ml: 2 }}>
                        {typeof formik.values.organizationLogo === 'object' ? (
                        // formik.values.organizationLogo.name // Display the uploaded file name
                        <img
                          src={formik.values.organizationLogoPreview}
                          alt='organizationLogo preview'
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                        />
                      ) : (
                        // <a href={formik.values.organizationLogo} target="_blank" rel="noopener noreferrer">
                        //   {formik.values.organizationLogo.split('/').pop()} {/* Display the fetched organizationLogo name */}
                        // </a>
                        <img
                            src={formik.values.organizationLogo}
                            alt="Icon Preview"
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                          />
                      )}</Box>
                    )}
                  </Box>
                  {formik.touched.organizationLogo && formik.errors.organizationLogo && (
                    <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.organizationLogo}</div>
                  )}
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Organization Banner/Cover Photo</CustomFormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button component="label">
                      Upload organizationBanner Image
                      <input
                        type="file"
                        hidden
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue('organizationBanner',file);
                          if(file){
                            formik.setFieldValue('organizationBannerPreview',URL.createObjectURL(file));
                          }
                        }}
                      />
                    </Button>
                    {formik.values.organizationBanner && (
                      <Box sx={{ ml: 2 }}>
                      {typeof formik.values.organizationBanner === 'object' ? (
                      <img
                        src={formik.values.organizationBannerPreview}
                        alt='organizationBanner preview'
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                      />
                    ) : (
                      <img
                          src={formik.values.organizationBanner}
                          alt="Icon Preview"
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                        />
                    )}</Box>
                    )}
                  </Box>
                  {formik.touched.organizationBanner && formik.errors.organizationBanner && (
                    <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.organizationBanner}</div>
                  )}
              </Grid>

              <Grid item xs={12} lg={12}>
                <CustomFormLabel>Organization Bio</CustomFormLabel>
                <CustomTextField
                placeholder='Write a Organization Bio ...'
                  fullWidth
                  multiline
                  rows={2}
                  id="organizationBio"
                  name="organizationBio"
                  value={formik.values.organizationBio}
                  onChange={formik.handleChange}
                  error={formik.touched.organizationBio && Boolean(formik.errors.organizationBio)}
                  helperText={formik.touched.organizationBio && formik.errors.organizationBio}
                />
              </Grid>

              <Grid item xs={12} lg={12}>
                <CustomFormLabel>Organization Description</CustomFormLabel>
                <CustomTextField
                placeholder="Write a Organization Description ..."
                  fullWidth
                  multiline
                  rows={2}
                  id="organizationDescription"
                  name="organizationDescription"
                  value={formik.values.organizationDescription}
                  onChange={formik.handleChange}
                  error={formik.touched.organizationDescription && Boolean(formik.errors.organizationDescription)}
                  helperText={formik.touched.organizationDescription && formik.errors.organizationDescription}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>State</CustomFormLabel>
                <CustomSelect
                    labelId="state-select"
                    fullWidth
                    id="state" 
                    name="state"
                    value={formik.values.state}
                    onChange={handleStateChange}
                    >
                       {StateNames.map(state => (
                    <MenuItem key={state.id} value={state.StateName}>
                        {state.StateName}
                    </MenuItem>
                ))}
                    </CustomSelect>
                    {formik.errors.state && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                            {' '}
                            {formik.errors.state}{' '}
                        </FormHelperText>
                    )}
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>District</CustomFormLabel>
                <CustomSelect
                    labelId="city-select"
                    fullWidth
                    id="city" 
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                    >
                       {CityNames.map(city => (
                    <MenuItem key={city.id} value={city.cityName}>
                        {city.cityName}
                    </MenuItem>
                ))}
                    </CustomSelect>
                    {formik.errors.city && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                            {' '}
                            {formik.errors.city}{' '}
                        </FormHelperText>
                    )}
              </Grid>

              <Grid item xs={12} lg={12}>
                <CustomFormLabel>Address</CustomFormLabel>
                <CustomTextField
                placeholder='Enter the organization address'
                  fullWidth
                  id="address"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>

              <Grid item xs={12} lg={12}>
                <CustomFormLabel>Map Selection</CustomFormLabel>
                <LocationInput setFieldValue={formik.setFieldValue}  mapSelection={formik.values.mapSelection}/>
                {formik.touched.mapSelection && formik.errors.mapSelection && (
                    <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.mapSelection}</div>
                  )
                }
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Owner Name</CustomFormLabel>
                <CustomTextField
                placeholder='Enter the owner name'
                  fullWidth
                  id="ownerName"
                  name="ownerName"
                  value={formik.values.ownerName}
                  onChange={formik.handleChange}
                  error={formik.touched.ownerName && Boolean(formik.errors.ownerName)}
                  helperText={formik.touched.ownerName && formik.errors.ownerName}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Owner Contact Number</CustomFormLabel>
                <CustomTextField
                  placeholder='Enter your Phone Number'
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
              <CustomFormLabel>Assistant Name</CustomFormLabel>
              <CustomTextField
                  placeholder='Enter The Assistant Name'
                  fullWidth
                  id="emergencyPhoneNumber"
                  name="emergencyPhoneNumber"
                  value={formik.values.emergencyPhoneNumber}
                  onChange={formik.handleChange}
                  error={formik.touched.emergencyPhoneNumber && Boolean(formik.errors.emergencyPhoneNumber)}
                  helperText={formik.touched.emergencyPhoneNumber && formik.errors.emergencyPhoneNumber}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Assistant Contact Number </CustomFormLabel>
                <CustomTextField
                placeholder='Enter Employee Numbers'
                  fullWidth
                  id="employeeNumbers"
                  name="employeeNumbers"
                  value={formik.values.employeeNumbers}
                  onChange={formik.handleChange}
                  error={formik.touched.employeeNumbers && Boolean(formik.errors.employeeNumbers)}
                  helperText={formik.touched.employeeNumbers && formik.errors.employeeNumbers}
                />
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Trade License</CustomFormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button component="label">
                      Upload tradeLicense Image
                      <input
                        type="file"
                        hidden
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue('tradeLicense',file);
                          if(file){
                            formik.setFieldValue('tradeLicensePreview',URL.createObjectURL(file));
                          }
                        }}
                      />
                    </Button>
                    {formik.values.tradeLicense && (
                      <Box sx={{ ml: 2 }}>
                      {typeof formik.values.tradeLicense === 'object' ? (
                      <img
                        src={formik.values.tradeLicensePreview}
                        alt='tradeLicense preview'
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                      />
                    ) : (
                      <img
                          src={formik.values.tradeLicense}
                          alt="Icon Preview"
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                        />
                    )}</Box>
                    )}
                  </Box>
                  {formik.touched.tradeLicense && formik.errors.tradeLicense && (
                    <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.tradeLicense}</div>
                  )}
              </Grid>

              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Organization Documents (PDF/Image/Word)</CustomFormLabel>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button component="label">
                      Upload organization Documents files
                      <input
                        type="file"
                        hidden
                        onChange={(event)=>{
                          const file = event.currentTarget.files[0];
                          formik.setFieldValue('organizationDocuments',file);
                          if(file){
                            formik.setFieldValue('organizationDocumentsPreview',URL.createObjectURL(file));
                          }
                        }}
                      />
                    </Button>
                    {formik.values.organizationDocuments && (
                      <Box sx={{ ml: 2 }}>
                      {typeof formik.values.organizationDocuments === 'object' ? (
                      <img
                        src={formik.values.organizationDocumentsPreview}
                        alt='organizationDocuments preview'
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                      />
                    ) : (
                      <img
                          src={formik.values.organizationDocuments}
                          alt="Icon Preview"
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '5px' }}
                        />
                    )}</Box>
                    )}
                  </Box>
                  {formik.touched.organizationDocuments && formik.errors.organizationDocuments && (
                    <div style={{ color: 'red', marginTop: '5px' }}>{formik.errors.organizationDocuments}</div>
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
  );
}
