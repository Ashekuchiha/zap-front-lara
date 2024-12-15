import React, { useEffect, useState } from 'react'
import PageContainer from 'src/components/container/PageContainer'
import ParentCard from 'src/components/shared/ParentCard'
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb'

import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, FormHelperText, Grid, MenuItem } from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import CustomSwitch from 'src/components/forms/theme-elements/CustomSwitch';
import LiveSwitch from './switch/LiveSwitch';
import CustomSelect from 'src/components/forms/theme-elements/CustomSelect';
import axios from 'axios';

const validationSchema = yup.object({
    amount:yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
});

export default function CommissionSetup() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch the service options from the API
    const fetchServices = async () => {
        try {
            const response = await axios.get('https://fullzapmor-api.vercel.app/api/services');
            setServices(response.data.data.data); // Assuming the data is an array of service objects
            console.log(response.data.data.data)
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    fetchServices();
}, []);
    const formik = useFormik({
        initialValues: {
            amount:'',
            service :"",
            type:"",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {

            try {
                const response = await fetch('https://fullzapmor-api.vercel.app/api/commission-setups', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                  },
                  body: JSON.stringify(values),
                });
        console.log(response)
                if (!response.ok) {
                  throw new Error('Failed to submit form');
                }
        
                const data = await response.json();
                console.log('Success:', data);
                alert('Form submitted successfully!');
              } catch (error) {
                console.error('Error:', error);
                alert('Failed to submit the form.');
              }
        //   alert(JSON.stringify(values, null, 2));
          console.log("values",values)
        },
      });

  return (
    <PageContainer title="Commission Setup" description="this is Custom Form page">
        <Breadcrumb title="Commission Setup" subtitle="" />
        <ParentCard title="Fill up the Following from">
        <form onSubmit={formik.handleSubmit}>
            <Grid container mb={4}>
                <Grid item xs={12} sm={12} lg={6}>
                    <CustomFormLabel>Service</CustomFormLabel>
                    <CustomSelect
                    labelId="service-select"
                    fullWidth
                    id="service" 
                    name="service"
                    value={formik.values.service}
                    onChange={formik.handleChange}
                    >
                       {services.map(service => (
                    <MenuItem key={service.id} value={service.name}>
                        {service.name}
                    </MenuItem>
                ))}
                    </CustomSelect>
                    {formik.errors.service && (
                        <FormHelperText error id="standard-weight-helper-text-email-login">
                            {' '}
                            {formik.errors.service}{' '}
                        </FormHelperText>
                    )}
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 1, lg: 1 }}>
                            <CustomFormLabel>amount</CustomFormLabel>
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
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 2, lg: 2 }}>
                            <CustomFormLabel>type</CustomFormLabel>
                            <CustomSelect
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
                        </Grid>

                        
                    </Grid>
                </Grid>
            </Grid>
            <Button color="primary" variant="contained" type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
        </ParentCard>
    </PageContainer>
  )
}
