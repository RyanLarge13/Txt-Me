import React, { useState } from "react";

// Build an input field that will stop causing unnecessary rerenders while still providing custom, reactive, interactive input fields
const ValueInput = React.memo(
  ({
    // retrieveValue is meant to be a callback function that sets the value of a userRef as to stop unnecessary rerenders at top level
    retrieveValue,
    placeholder,
    type,
  }: {
    retrieveValue: (value: string) => void;
    placeholder: string;
    type: string;
  }): JSX.Element => {
    const [value, setValue] = useState("");

    return (
      <input
        autoFocus={true}
        onChange={(e) => {
          retrieveValue(e.target.value);
          setValue(e.target.value);
        }}
        type={type}
        value={value}
        className="focus:outline-none py-2 my-1 bg-[transparent] w-full"
        placeholder={placeholder}
      />
    );
  }
);

export default ValueInput;
