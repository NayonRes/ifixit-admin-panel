import React, { useState } from "react";

const CheckboxList = () => {
  const issueList = [
    { name: "Display Assemble", price: 300, _id: "678ff267240a6190104cb5eb" },
    { name: "Battery Assemble", price: 1000, _id: "678ff267240a6190104cb5ec" },
    { name: "Audio Issue", price: 600, _id: "678ff267240a6190104cb5ed" },
  ];

  const checkedIssue = [
    { name: "Display Assemble", price: 300, _id: "678ff267240a6190104cb5eb" },
    { name: "Battery Assemble", price: 1000, _id: "678ff267240a6190104cb5ec" },
  ];

  const [checkedItems, setCheckedItems] = useState(
    issueList.map((issue) => checkedIssue.some((ci) => ci.name === issue.name))
  );

  const handleCheckboxChange = (index) => {
    const updatedCheckedItems = [...checkedItems];
    updatedCheckedItems[index] = !updatedCheckedItems[index];
    setCheckedItems(updatedCheckedItems);
  };

  return (
    <div>
      <h3>Issue List</h3>
      <ul>
        {issueList.map((issue, index) => (
          <li key={issue._id}>
            <label>
              <input
                type="checkbox"
                checked={checkedItems[index]}
                onChange={() => handleCheckboxChange(index)}
              />
              {issue.name} - ${issue.price}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CheckboxList;
