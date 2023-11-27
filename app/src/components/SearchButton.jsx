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
        className={`placeholder-pink-800 [font-['Poppins'] font-medium text-[16px] leading-[26px] min-h-[40px] px-4 rounded-[10px] ${styles}`}
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
