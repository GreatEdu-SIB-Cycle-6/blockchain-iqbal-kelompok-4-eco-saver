import React from "react";

const SearchButton = ({
  btnType,
  title,
  handleClick,
  styles,
  placeholder,
  value,
  onChange,
}) => {
  return (
      <input
        type={btnType}
        className={`placeholder-gray-300 font-light [font-['Poppins'] text-m leading-[26px] min-h-[40px] px-4 rounded-[10px] ${styles}`}
        onClick={handleClick}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      >
        {title}
      </input>
  );
};

export default SearchButton;
