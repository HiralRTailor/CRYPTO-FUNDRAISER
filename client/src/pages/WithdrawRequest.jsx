import React, { useState,useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money, withdraw } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';
import { NotificationManager } from 'react-notifications';



const WithdrawRequest = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {createWithdrawalRequest, getCampaignDetails } = useStateContext();
  const [walletAddress, setWalletAddress] = useState('');
  const [isValidAddress, setIsValidAddress] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [owners, set_address] = useState(false);



const location = useLocation();
const pathSegments = location.pathname.split('/');
// console.log(pathSegments)
const campaignId = ethers.BigNumber.from(pathSegments[2]); // Assuming title is the third segment in the path
// console.log(campaignId)
const Title = pathSegments[3]; // Assuming ID is the fourth segment in the path
const stringWithSpace = Title.replace(/%20/g, ' ');
// const stringWithSpace2 = stringWithSpace.replace(/%22/g, ' ');
// console.log(stringWithSpace)

  const [form, setForm] = useState({
    pId:'',
    reason: '',
    withdrawamount: '',
    payee: '', 
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          // Request access to the user's accounts
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          setIsConnected(true);
          // Get the user's wallet addresses
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });

          // Do something with the wallet addresses (e.g., store them in state or use them for further processing)
          setWalletAddress(accounts);
        } catch (error) {
          // User denied account access or there was an error
          setIsConnected(false);
          NotificationManager.warning('Please connect your wallet to proceed.', 3000);
        }
      } else {
        setIsConnected(false);
        NotificationManager.warning('Please install a compatible Ethereum wallet to proceed.', 3000);
      }
    };

    checkWalletConnection();
  }, []);

  // Handle input change
  const handleInputChange = (event) => {
    const { value } = event.target;
    setWalletAddress(value);

    // Check if the entered address matches the ENS pattern
    setIsValidAddress(ensAddressPattern.test(value));
  };

//HIRAL
  const handleSubmit = async (e) => {
    e.preventDefault();
    const etherAmount = parseFloat(form.withdrawamount);

    if (etherAmount <= 0) {
      setIsLoading(false);
      NotificationManager.warning('Ether amount cannot be negative', 3000);
      setForm({ ...form, withdrawamount: '' });
      return;
    }

    // Check if the entered amount is greater than the collected amount
    const campaignInfo = await getCampaignDetails(campaignId); // Assuming you have a function to retrieve the campaign information
    // console.log("campaignInfo")
    // console.log(campaignInfo)
    const owner=campaignInfo.owners
    // set_address(owner)
    // Check whether current user s owner of campaign
    console.log(owner)
    console.log(walletAddress[0])
    const isOwner = owner.toLowerCase() === walletAddress[0].toLowerCase();
    if (!isOwner){
      setIsLoading(false);
      NotificationManager.warning('Only owner of the campaign can create withdraw request');
      return;

    }

    console.log(campaignInfo.amountCollecteds)
    const x=campaignInfo.amountCollecteds
    const etherValue = ethers.utils.formatEther(x.toString());
    // console.log("etherValue")

    // console.log(etherValue);
    // console.log(etherAmount)
    if (etherAmount > etherValue) {
      alert('Withdraw amount cannot be greater than the amount collected. You can withdraw upto '+ etherValue);
      setForm({ ...form, withdrawamount: '' });
      return;
    }
  

    // Regular expression pattern for Ethereum addresses
    const ethAddressPattern = /^0x[a-fA-F0-9]{40}$/;

    if (!ethAddressPattern.test(form.payee)) {
      setIsLoading(false);
      NotificationManager.warning('Please enter a valid Ethereum address.', 3000);
      setForm({ ...form, payee: '' });
      return;
    }
    setIsLoading(true);
    await createWithdrawalRequest({pId: campaignId ,reason: form.reason, withdrawamount: ethers.utils.parseUnits(form.withdrawamount, 18), payee: ethers.utils.getAddress(form.payee)});
    // await createWithdrawalRequest({});
    setIsLoading(false);
    navigate('/');
  };


//Hiral end
  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Create Withdraw Request</h1>
      </div>

      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
      <h2 className="font-epilogue font-semibold text-[18px] text-white uppercase">Campaign Title</h2>
      <h2 className="font-epilogue font-semibold text-[18px] text-white uppercase">{stringWithSpace}</h2>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">


        <FormField 
            labelName="Reason *"
            placeholder="Reason to Withdraw Amount"
            isTextArea //hiral
            value={form.reason}
            handleChange={(e) => handleFormFieldChange('reason', e)}
          />


        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="Amount *"
            placeholder="ETH 0.50"
            inputType="text" //hiral
            value={form.withdrawamount}
            handleChange={(e) => handleFormFieldChange('withdrawamount', e)}
          />

        </div>
        {/* Hiral */}
        <FormField 
            labelName="Payee *"
            placeholder="Account Address of the requester"
            inputType="text" //hiral
            value={form.payee}
            handleChange={(e) => handleFormFieldChange('payee', e)}
            // onChange={handleInputChange}
          />
        {/* {!isValidAddress && <p>Please enter a valid ENS address.</p>} */}


          <div className="flex justify-center items-center mt-[40px]">
            <CustomButton 
              btnType="submit"
              title="Submit withdraw Request"
              styles="bg-[#1dc071]"
            />
          </div>
      </form>
    </div>
  )
}

export default WithdrawRequest