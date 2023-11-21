import React from "react";

const FormField = ({
  labelName,
  placeholder,
  inputType,
  isTextArea,
  value,
  handleChange,
}) => {
  return (
    <label className="flex-1 w-full flex flex-col">
      {labelName && (
        <span
          className="font-['Poppins'] font-medium text-[14px] leading-[22px] text-white mb-[10px]
            "
        >
          {labelName}
        </span>
      )}
      {isTextArea ? (
        <textarea
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          rows={10}
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] bg-transparent font-epilogue text-white text-[14px]
          placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] outline-none border-[1px]"
        />
      ) : (
        <input
          required
          value={value}
          onChange={handleChange}
          type={inputType}
          step="0.1"
          placeholder={placeholder}
          className="py-[15px] sm:px-[25px] px-[15px] bg-transparent font-epilogue text-white text-[14px]
          placeholder:text-[#4b5264] rounded-[10px] sm:min-w-[300px] outline-none border-[1px]"
        />
      )}
    </label>
  );
};

export default FormField;
