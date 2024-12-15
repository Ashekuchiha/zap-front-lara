import React from 'react';
import { Autocomplete } from '@mui/material';
import CustomCheckbox from 'src/components/forms/theme-elements/CustomCheckbox';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
// custom
// import CustomTextField from '../../theme-elements/CustomTextField';
// import CustomCheckbox from '../../theme-elements/CustomCheckbox';
// Top 100 films as rated by IMDb users.

const MyCheckBox = ({data}) => {
  return (
  <Autocomplete
    multiple
    id="checkboxes-tags-demo"
    options={data}
    disableCloseOnSelect
    getOptionLabel={(option) => option.title}
    renderOption={(props, option, { selected }) => (
      <li {...props}>
        <CustomCheckbox style={{ marginRight: 8 }} checked={selected} />
        {option.title}
      </li>
    )}
    fullWidth
    renderInput={(params) => (
      <CustomTextField {...params} placeholder="Favorites" aria-label="Favorites" />
    )}
  />)
  };

export default MyCheckBox;
