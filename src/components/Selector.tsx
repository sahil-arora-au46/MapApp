import React, { useState } from 'react';

const DropdownSelector = (props) => {
  // State to store the selected value
  const [selectedValue, setSelectedValue] = useState('');

  // Handler function to update the selected value
  const handleSelectChange = (event) => {

    setSelectedValue(event.target.value);
    console.log(event.target.value,"chil")

    // Assuming the parent function is named `onSelectionChange`
    if (props.onSelectionChange) {
        console.log("in function block",typeof(props.onSelectionChange))
      props.onSelectionChange(event.target.value); // Pass the selected value
    }
  };

  return (
    <div className={props.className}>
      <select value={selectedValue} onChange={handleSelectChange}>
        <option value="" disabled>Draw Shapes</option>
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option === 'LinearRing' ? 'Line' : option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownSelector;
