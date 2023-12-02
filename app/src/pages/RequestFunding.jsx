import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { checkIfImage } from "../utils";
import { FormField, CustomButton, Loader } from "../components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RequestFunding = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { requestCampaign } = useStateContext();
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
  const handleSubmit = async (event) => {
    event.preventDefault();

    checkIfImage(form.image, async (exist) => {
      if (exist) {
        setIsLoading(true);
        await requestCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        setIsLoading(false);
        navigate("/campaign");
      } else {
        alert("Masukkan link gambar yang valid!");
        setForm({ ...form, image: "" });
      }
    });
    toast("Request Funding Success!, Wait for Admin to Accept the Request!")
  };

  return (
    <div className="max-w-[1000px] mx-auto border-solid border-2 border-[#14213d] flex flex-col rounded-[10px] sm:p-10 p-4 md:items-center md:justify-center">
      <ToastContainer />
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[150px] bg-transparent border-[#22223b] border rounded-[10px]">
        <h1 className="font-['Poppins'] item-start font-medium text-white sm:text-[25px] text-[21px] leading-[38px]">
          Start Request Funding
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-[950px] mt-[65px] flex flex-col gap-[30px]"
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Masukan Nama Anda :"
            placeholder="Masukan nama anda"
            inputType="text"
            value={form.name}
            handleChange={(event) => handleFormFieldChange("name", event)}
          />
          <FormField
            labelName="Masukan Judul Donasi Anda :"
            placeholder="Masukan judul anda"
            inputType="text"
            value={form.title}
            handleChange={(event) => handleFormFieldChange("title", event)}
          />
        </div>
        <FormField
          labelName="Ceritakan Tentang Donasi Anda :"
          placeholder="Masukan cerita anda"
          isTextArea
          value={form.description}
          handleChange={(event) => handleFormFieldChange("description", event)}
        />
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            labelName="Target Donasi :"
            placeholder="BSC 0.1"
            inputType="text"
            value={form.target}
            handleChange={(event) => handleFormFieldChange("target", event)}
          />
          <FormField
            labelName="Tanggal Berakhir :"
            placeholder="Masukan tanggal berakhir donasi anda"
            inputType="date"
            value={form.deadline}
            handleChange={(event) => handleFormFieldChange("deadline", event)}
          />
        </div>
        <FormField
          labelName="Masukan Url Gambar Anda :"
          placeholder="Masukan link gambar"
          inputType="url"
          value={form.image}
          handleChange={(event) => handleFormFieldChange("image", event)}
        />
        <div className="flex justify-center items-center">
          <CustomButton
            btnType="submit"
            title="Request Campaign"
            styles="bg-transparent border border-[#52b788] hover:bg-[#52b788] text-white"
          />
        </div>
      </form>
    </div>
  );
};

export default RequestFunding;
