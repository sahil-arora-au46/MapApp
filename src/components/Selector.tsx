import React, { useState, ChangeEvent } from 'react';

interface DropdownSelectorProps {
  className: string;
  options: string[];
  onSelectionChange?: (selectedValue: string) => void;
}

const DropdownSelector: React.FC<DropdownSelectorProps> = (props) => {
  // State to store the selected value
  const [selectedValue, setSelectedValue] = useState<string>('');

  // Handler function to update the selected value
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedValue(selectedValue);
    console.log(selectedValue, "chil");

    // Assuming the parent function is named `onSelectionChange`
    if (props.onSelectionChange) {
      console.log("in function block", typeof (props.onSelectionChange));
      props.onSelectionChange(selectedValue); // Pass the selected value
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
