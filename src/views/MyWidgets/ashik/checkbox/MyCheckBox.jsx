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
      value={data.filter(option => value.includes(option.title))} // Match selected values with options
      onChange={(_, newValue) => {
        const titles = newValue.map(option => option.title); // Extract only titles
        onChange(titles); // Pass only titles array to Formik
      }}
      isOptionEqualToValue={(option, value) => option.title === value} // Compare option and value by title
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
