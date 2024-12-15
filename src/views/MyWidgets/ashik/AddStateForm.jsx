import React, { useEffect, useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import ParentCard from 'src/components/shared/ParentCard';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Grid } from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import LocationInput from './locationInput/LocationInput';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import Spinner from 'src/views/spinner/Spinner';

// Validation schema using Yup
const validationSchema = yup.object({
  StateName: yup
    .string()
    .min(2, 'Too Short!')
    .max(80, 'Too Long!')
    .required('Location name is required'),
  longitude: yup
    .string()
    .min(2, 'Too Short!')
    .max(500, 'Too Long!'),
  latitude: yup
    .string()
    .min(2, 'Too Short!')
    .max(500, 'Too Long!'),
});

export default function AddStateForm() {
  // const basic = "https://fullzapmor-api.vercel.app";
  const basic = "http://127.0.0.1:8000";
  const mainBasic = "http://localhost:5000";
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false); // Loading state for fetching data

  const formik = useFormik({
    initialValues: {
      StateName: '',
      longitude: '',
      latitude:'',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const url = id
          ? `${basic}/api/states/${id}`
          : `${basic}/api/states`;
        const method = id ? 'PUT' : 'POST';

        // Send JSON instead of FormData
        const response = await fetch(url, {
          method: method,
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json', // Set Content-Type to JSON
          },
          body: JSON.stringify({
            StateName: values.StateName,
            latitude: values.latitude, // Assuming it's an array of [latitude, longitude]
            longitude: values.longitude,
          }),
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
        navigate(`/admin/location/state/all`);
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
//edit
  useEffect(() => {
    if (id) {
      setLoading(true); // Loading while fetching data
      fetch(`${basic}/api/states/${id}`)
        .then((response) => response.json())
        .then((data) => {console.log("fetchdata",data)
          formik.setValues({
            StateName: data.data.StateName || '',
            latitude: data.data.latitude || '',
            longitude: data.data.longitude || '',
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]); // Fetch data on mount if there's an ID

  return (
    <PageContainer title="State Location" description="This is the Custom Form page">
      <Breadcrumb title={id ? 'Edit state location' : 'Add state location'} subtitle="" />
      <ParentCard title={id ? 'Edit the state Form' : 'Fill up the state Form'}>
        {loading ? (
          <Spinner/>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={6}>
                <CustomFormLabel>State Name</CustomFormLabel>
                <CustomTextField
                  placeholder='Enter the State Name'
                  fullWidth
                  id="StateName"
                  name="StateName"
                  value={formik.values.StateName}
                  onChange={formik.handleChange}
                  error={formik.touched.StateName && Boolean(formik.errors.StateName)}
                  helperText={formik.touched.StateName && formik.errors.StateName}
                />
              </Grid>
            </Grid>
              <Grid container spacing={2} mb={3}>
              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Longitude</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="longitude"
                  name="longitude"
                  value={formik.values.longitude}
                  onChange={formik.handleChange}
                  error={formik.touched.longitude && Boolean(formik.errors.longitude)}
                  helperText={formik.touched.longitude && formik.errors.longitude}
                />
              </Grid>
              <Grid item xs={12} lg={6}>
                <CustomFormLabel>Latitude</CustomFormLabel>
                <CustomTextField
                  fullWidth
                  id="latitude"
                  name="latitude"
                  value={formik.values.latitude}
                  onChange={formik.handleChange}
                  error={formik.touched.latitude && Boolean(formik.errors.latitude)}
                  helperText={formik.touched.latitude && formik.errors.latitude}
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