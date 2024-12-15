import React from 'react'
import PageContainer from 'src/components/container/PageContainer'
import ParentCard from 'src/components/shared/ParentCard'
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb'

import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Grid } from '@mui/material';
import CustomFormLabel from 'src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

const validationSchema = yup.object({
    catname:yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
    patcat:yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
    catdes:yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
    caticon:yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
    Location:yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
    bio:yup.string().min(2, 'Too Short!').max(80, 'Too Long!').required('required'),
});

export default function ServiceCategory() {

    const formik = useFormik({
        initialValues: {
            catname:'',
            patcat:'',
            catdes:'',
            caticon:'',
            Location:'',
            bio:'',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          alert(JSON.stringify(values, null, 2));
          console.log("values",values)
        },
      });

  return (
    <PageContainer title="Service Category" description="this is Custom Form page">
        <Breadcrumb title="Service Category" subtitle="" />
        <ParentCard title="Fill up the Following from">
        <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2} mb={3}>
                    <Grid container spacing={2} mb={3}>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 1, lg: 1 }}>
                            <CustomFormLabel>Category name</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="catname"
                                catname="catname"
                                value={formik.values.catname}
                                onChange={formik.handleChange}
                                error={formik.touched.catname && Boolean(formik.errors.catname)}
                                helperText={formik.touched.catname && formik.errors.catname}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 2, lg: 2 }}>
                            <CustomFormLabel>Parent category</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="patcat"
                                name="patcat"
                                value={formik.values.patcat}
                                onChange={formik.handleChange}
                                error={formik.touched.patcat && Boolean(formik.errors.patcat)}
                                helperText={formik.touched.patcat && formik.errors.patcat}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 3, lg: 3 }}>
                            <CustomFormLabel>Category description</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="catdes"
                                name="catdes"
                                value={formik.values.catdes}
                                onChange={formik.handleChange}
                                error={formik.touched.catdes && Boolean(formik.errors.catdes)}
                                helperText={formik.touched.catdes && formik.errors.catdes}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 4, lg: 4 }}>
                            <CustomFormLabel>Category icon</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="caticon"
                                name="caticon"
                                value={formik.values.caticon}
                                onChange={formik.handleChange}
                                error={formik.touched.caticon && Boolean(formik.errors.caticon)}
                                helperText={formik.touched.caticon && formik.errors.caticon}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 4, lg: 4 }}>
                            <CustomFormLabel>Location</CustomFormLabel>
                            <CustomTextField
                                fullWidth
                                id="Location"
                                name="Location"
                                value={formik.values.Location}
                                onChange={formik.handleChange}
                                error={formik.touched.Location && Boolean(formik.errors.Location)}
                                helperText={formik.touched.Location && formik.errors.Location}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} lg={6} order={{ xs: 4, lg: 4 }}>
                            <CustomFormLabel>Bio</CustomFormLabel>
                            <CustomTextField
                                multiline
                                fullWidth
                                id="bio"
                                name="bio"
                                value={formik.values.bio}
                                onChange={formik.handleChange}
                                error={formik.touched.bio && Boolean(formik.errors.bio)}
                                helperText={formik.touched.bio && formik.errors.bio}
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
