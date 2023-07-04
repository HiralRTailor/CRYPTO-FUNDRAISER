import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import { NotificationManager } from 'react-notifications';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '', 
    minContribution:'',
    deadline: '',
    image: ''
   
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

//HIRAL
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const isValidImage = await new Promise((resolve) => {
      checkIfImage(form.image, (exists) => {
        resolve(exists);
      });
    });
  
    if (!isValidImage) {
      NotificationManager.warning('Provide a valid image URL', 3000);
      setForm({ ...form, image: '' });
      return;
    }
  
    const deadlineDate = new Date(form.deadline).getTime();
    const currentDate = Date.now();
    if (deadlineDate < currentDate) {
      NotificationManager.warning('Provide a valid deadline datetime', 'Invalid deadline', 3000);
      setForm({ ...form, deadline: '' });
      return;
    }
  
    const etherAmount = parseFloat(form.target);
    if (etherAmount <= 0) {
      NotificationManager.warning('Ether amount cannot be negative', 3000);
      setForm({ ...form, target: '' });
      return;
    }

    const minAmount = parseFloat(form.minContribution);
    if (minAmount < 0) {
      NotificationManager.warning('Ether amount cannot be negative', 3000);
      setForm({ ...form, minContribution: '' });
      return;
    }

    if (minAmount == etherAmount || minAmount > etherAmount) {
      NotificationManager.warning('Minimum Contribution cannot be equal to or greater then Goal', 3000);
      setForm({ ...form, minContribution: '' });
      return;
    }

    setIsLoading(true);
    await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) ,minContribution: ethers.utils.parseUnits(form.minContribution, 18) });
    setIsLoading(false);
    navigate('/');
  };
//Hiral end
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Campaign</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="Campaign Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField 
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">You will get 100% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text" //hiral
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          {/* Hiral */}
          <FormField 
            labelName="Minimum Contribution *"
            placeholder="ETH 0.50"
            inputType="text" //hiral
            value={form.minContribution}
            handleChange={(e) => handleFormFieldChange('minContribution', e)}
          />

          
          <FormField 
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField 
            labelName="Campaign image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Submit new campaign"
              styles="bg-[#1dc071]"
            />
          </div>
      </form>
    </div>
  )
}

export default CreateCampaign