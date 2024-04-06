
import React, { useState, ChangeEvent } from 'react';

// Define the props interface 
interface DropdownSelectorProps {
 className: string; 
 options: string[]; 
 onSelectionChange?: (selectedValue: string) => void; 
}

// Define the DropdownSelector component
const DropdownSelector: React.FC<DropdownSelectorProps> = (props) => {
 // State to store the currently selected value from the dropdown
 const [selectedValue, setSelectedValue] = useState<string>('');

 // Handler function to update the selected value state and call the onSelectionChange prop if provided
 const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    
  // Get the selected value from the event
    const selectedValue = event.target.value; 
    setSelectedValue(selectedValue); 
  
    // Check if the onSelectionChange prop is provided and call it with the selected value
    if (props.onSelectionChange) {
      // Passing selected value to MapComponent 
      props.onSelectionChange(selectedValue); 
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