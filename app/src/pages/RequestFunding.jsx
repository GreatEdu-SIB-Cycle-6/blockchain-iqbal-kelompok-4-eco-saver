import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { checkIfImage } from "../utils";
import { FormField, CustomButton } from "../components";

const RequestFunding = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });

  const handleFormFieldChange = (fieldName, event) => {
    setForm({ ...form, [fieldName]: event.target.value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(form)

  };

  return (
    <div className="bg-gradient-to-b from-black to-slate-900 flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && "Loading...."}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-['Poppins'] font-bold text-white sm:text-[25px] text-[18px] leading-[38px]">
          Start Request Funding
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Masukan Nama Anda"
            placeholder="Masukan nama anda"
            inputType="text"
            value={form.name}
            handleChange={(event) => handleFormFieldChange("name", event)}
          />
          <FormField
            labelName="Masukan Judul Donasi Anda"
            placeholder="Masukan judul anda"
            inputType="text"
            value={form.title}
            handleChange={(event) => handleFormFieldChange("title", event)}
          />
        </div>
        <FormField
          labelName="Ceritakan Tentang Donasi Anda"
          placeholder="Masukan cerita anda"
          isTextArea
          value={form.description}
          handleChange={(event) => handleFormFieldChange("description", event)}
        />
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Target Donasi"
            placeholder="BSC 0.1"
            inputType="text"
            value={form.target}
            handleChange={(event) => handleFormFieldChange("target", event)}
          />
          <FormField
            labelName="Masukan Tanggal Berakhir Donasi Anda"
            placeholder="Masukan tanggal berakhir donasi anda"
            inputType="date"
            value={form.deadline}
            handleChange={(event) => handleFormFieldChange("deadline", event)}
          />
        </div>
        <FormField
          labelName="Masukan Url Image anda"
          placeholder="Masukan link gambar"
          inputType="url"
          value={form.image}
          handleChange={(event) => handleFormFieldChange("image", event)}
        />
        <div className="flex justify-center items-center mt-[10px]">
          <CustomButton
            btnType="submit"
            title="Submit new campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default RequestFunding;
