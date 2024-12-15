// import { useState, useEffect } from "react";

// const { default: CustomSwitch } = require("src/components/forms/theme-elements/CustomSwitch");

// const LiveSwitch = ({ onSwitchChange, initialChecked }) => {
//   const [checked, setChecked] = useState(initialChecked || false);

//   useEffect(() => {
//     setChecked(initialChecked); // Update the switch if Formik value changes
//   }, [initialChecked]);

//   const handleChange = (event) => {
//     const isChecked = event.target.checked;
//     setChecked(isChecked);

//     // Return 1 for true (checked), 0 for false (unchecked)
//     onSwitchChange(isChecked ? 1 : 0);
//   };

//   return (
//     <div>
//       <CustomSwitch checked={checked} onChange={handleChange} />
//     </div>
//   );
// };

// export default LiveSwitch;


import { useState, useEffect } from "react";
import CustomSwitch from "src/components/forms/theme-elements/CustomSwitch";

const LiveSwitch = ({ onSwitchChange, initialChecked }) => {
  const [checked, setChecked] = useState(initialChecked || false);

  useEffect(() => {
    setChecked(initialChecked); // Update the switch if Formik value changes
  }, [initialChecked]);

  const handleChange = (event) => {
    const isChecked = event.target.checked;
    setChecked(isChecked);

    // Return 1 for true (checked), 0 for false (unchecked)
    onSwitchChange(isChecked ? true : false);
  };

  return (
    <div>
      <CustomSwitch checked={checked} onChange={handleChange} />
    </div>
  );
};

export default LiveSwitch;
