import React from 'react';
import { Autocomplete } from '@mui/material';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';

const MyCheckBox = ({ data, value, onChange }) => {
  return (
    <Autocomplete
      multiple
      id="checkboxes-tags-demo"
      options={data}
      disableCloseOnSelect
      value={value} // Pass the value from Formik
      onChange={(_, newValue) => onChange(newValue)} // Update Formik when selection changes
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <CustomCheckbox style={{ marginRight: 8 }} checked={selected} />
          {option.title}
        </li>
      )}
      fullWidth
      renderInput={(params) => (
        <CustomTextField {...params} placeholder="Select..." aria-label="Favorites" />
      )}
    />
  );
};

export default MyCheckBox;
