import React from 'react'
import PageContainer from 'src/components/container/PageContainer'
import ParentCard from 'src/components/shared/ParentCard'
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb'

import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Grid } from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import LiveSwitch from './switch/LiveSwitch';

const validationSchema = yup.object({
    name:yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
    description:yup.string().min(2, 'Too Short!').max(500, 'Too Long!').required('required'),
    icon: yup.mixed().required('icon is required'),
});

export default function AddServiceForm() {
    const basic = "https://fullzapmor-api.vercel.app";
    const mainBasic = "http://localhost:5000";
    const formik = useFormik({
        initialValues: {
            name:'',
            description:'',
            icon:null,
            featured:false,
        },
        validationSchema: validationSchema,
        // onSubmit: (values) => {
        //   alert(JSON.stringify(values, null, 2));
        //   console.log("values",values)

        // },
        onSubmit: async (values) => {
            console.log(JSON.stringify(values));
            try {
              const response = await fetch(`${basic}/api/services`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'accept': 'application/json',

                },
                body: JSON.stringify(values),
              });
              if (!response.ok) {
                throw new Error('Failed to submit form');
              }
      
              const data = await response.json();
              console.log('Success:', data);
            //   alert('Form submitted successfully!');
            } catch (error) {
              console.error('Error:', error);
              alert('Failed to submit the form.');
            }
          },
      });

  return (
    <PageContainer title="Service" description="this is Custom Form page">
        <Breadcrumb title="Service" subtitle="" />
        <ParentCard title="Fill up the Following from">
        <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} mb={3}>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 1, lg: 1 }}>
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
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 2, lg: 2 }}>
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
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 3, lg: 3 }}>
                            <CustomFormLabel>Icon</CustomFormLabel>
                            <Button
                                component="label"
                            >
                                Upload icon Image
                                <input
                                type="file"
                                hidden
                                onChange={(event) => formik.setFieldValue('icon', event.currentTarget.files[0])}
                                />
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 4, lg: 4 }}>
                            <CustomFormLabel>Featured</CustomFormLabel>
                             <LiveSwitch
                                onSwitchChange={(value) =>
                                    formik.setFieldValue('featured', value) // Update Formik's field value
                                }
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Button color="primary" variant="contained" type="submit">Submit</Button>
            </form>
        </ParentCard>
    </PageContainer>
  )
}
