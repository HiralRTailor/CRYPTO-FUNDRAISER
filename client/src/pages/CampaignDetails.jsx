import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { calculateBarPercentage, daysLeft } from '../utils';
import { thirdweb } from '../assets';
import { NotificationManager } from 'react-notifications';


const CampaignDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { donate, getDonations, contract, address, getApprovers,getCampaignDetails, chainId, connect } = useStateContext();

  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [donators, setDonators] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [created, setCreated] = useState([]);

  // const [balance, setBalance] = useState(null);
  console.log("deadline",state.deadline)
  const timestamp = Date.now();
  console.log(timestamp);

  const remainingDays = daysLeft(state.deadline);

  console.log('state: ');
  console.log(state);

  
  const fetchDonators = async () => {
    // Commented by Hiral
    // const data = await getDonations(state.pId);
    const data = await getDonations(state.pId.toString());
    setDonators(data);
    console.log('Donor list:');
    console.log(donators);
  }

  const fetchApprovers = async () => {
    // Commented by Hiral
    // const data = await getDonations(state.pId);
    const data = await getApprovers(state.pId.toString());
    setApprovers(data);
    console.log('Approvers list:');
    console.log(approvers);
  }

  const fetchdetails = async () => {
    // Commented by Hiral
    // const data = await getDonations(state.pId);
    console.log(state.pId.toString())
    const data = await getCampaignDetails(state.pId.toString());
    console.log(data)
    setCreated(data.withdrawalRequestCreateds)
  
  }
  // console.log("Amounts")
  // console.log(state.target)
  // console.log(state.amountCollected)

  // console.log("remainingDays");
  // console.log({remainingDays})

  useEffect(() => {
    if(contract) fetchDonators();
    if(contract) fetchApprovers();
    if(contract) fetchdetails();


  }, [contract, address])

  const handleDonate = async () => {
    if (!address) {
      NotificationManager.warning('Please connect your wallet to proceed.', 3000);
      return;
    }

  // console.log("amount donated")
    const collected = parseFloat(state.amountCollected)
    const current = parseFloat(amount)
    const total = collected + current
    const left = parseFloat(state.target)-collected
    const roundedNumber = left.toFixed(2);
    // console.log(total)
    // console.log(state.target)
   
    if (current <= 0 || amount === "") {
      NotificationManager.warning('Ether amount cannot be negative', 3000);
      setAmount('');
      return;
    }


    if (total > parseFloat(state.target)){
      setIsLoading(false);
      alert("Thank you for your generous donation! You have exceeded the target amount. You can Donate upto "+roundedNumber);
      setAmount('');
      return;
    }
    else{
    setIsLoading(true);
    const res = await donate(state.pId, amount); 
    navigate('/')
    setIsLoading(false);
    setAmount('');
    
    if (res) {
      NotificationManager.success(
        `${input.current.value} ETH successfully donated to Campaign ${state.id}`,
        'Transaction Successful',
        3000
      );
    } else {
      NotificationManager.error(
        `Some error occurred while sending the funds. Please try again`,
        'Transaction Failed',
        3000
      );
    }

    }
  };
  
  const handleWithdrawRequest = () => {
    if (!address) {
      NotificationManager.warning('Please connect your wallet to proceed.', 3000);
      return;
    }
    navigate(`/WithdrawRequest/${state.pId}/${state.title}`);

  };
  console.log("created")

  console.log(created)
  // Get the unique count of donators
  const uniqueDonatorsCount = new Set(donators.map((item) => item.donator)).size;

// Check whether current user s owner of campaign
  const isOwner = state.owner.toLowerCase() === address?.toLowerCase();


  return (
    <div>
      {isLoading && <Loader />}
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">{state.title}</h4>
      </div>
      <div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
        <div className="flex-1 flex-col">
          <img src={state.image} alt="campaign" className="w-full h-[410px] object-cover rounded-xl"/>
          <div className="relative w-full h-[5px] bg-[#3a3a43] mt-2">
            <div className="absolute h-full bg-[#4acd8d]" style={{ width: `${calculateBarPercentage(state.target, state.amountCollected)}%`, maxWidth: '100%'}}>
            </div>
          </div>
        </div>
     
        <div className="flex md:w-[150px] w-full flex-wrap justify-between gap-[30px]">
        {/* HIRAL */}
        
        {remainingDays > 0 && state.target != state.amountCollected ? (
          <CountBox title="Days Left" value={remainingDays} />
          ):state.target == state.amountCollected ?(
          <CountBox title="Days Left" value="ENDED" />
          ):
          <CountBox title="Days Left" value="EXPIRED" />
        } 
          <CountBox title={`Raised of ${state.target}`} value={state.amountCollected} />
          <CountBox title="Approvers" value={approvers.length} />
          <CountBox title="Total Backers" value={uniqueDonatorsCount} />

        </div>
      </div>
        {/* Hiral End */}
      <div className="mt-[60px] flex lg:flex-row flex-col gap-5">
        <div className="flex-[2] flex flex-col gap-[40px]">
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Creator</h4>

            <div className="mt-[20px] flex flex-row items-center flex-wrap gap-[14px]">
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-full bg-[#2c2f32] cursor-pointer">
                <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain"/>
              </div>
              <div>
                <h4 className="font-epilogue font-semibold text-[14px] text-white break-all">
                  <a href={'https://sepolia.etherscan.io/address/' + state.owner} target="blank">{state.owner}</a>
                </h4>
                <p className="mt-[4px] font-epilogue font-normal text-[12px] text-[#808191]">10 Campaigns</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Story</h4>

              <div className="mt-[20px]">
                <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description}</p>
              </div>
          </div>

          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Donators</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {donators.length > 0 ? donators.map((item, index) => (
                  <div key={`${item.donator}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.donator}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.donation}</p>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No donators yet. Be the first one!</p>
                )}
              </div>
          </div>
          <div>
            <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Approvers</h4>

              <div className="mt-[20px] flex flex-col gap-4">
                {approvers.length > 0 ? approvers.map((item, index) => (
                  <div key={`${item.approvers}-${index}`} className="flex justify-between items-center gap-4">
                    <p className="font-epilogue font-normal text-[16px] text-[#b2b3bd] leading-[26px] break-ll">{index + 1}. {item.approvers}</p>
                    <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] break-ll">{item.approval}</p>
                  </div>
                )) : (
                  <p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">No approvers yet. Be the first one!</p>
                )}
              </div>
          </div>
        </div>

{/* Fund Card For donation  HIRAL */}
{state.target !== state.amountCollected && remainingDays > 0 ? (
        <div className="flex-1">
          <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Fund</h4>   

          <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
            <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191]">
              Fund the campaign
            </p>
            <div className="mt-[30px]">
              <input 
                type="text"
                placeholder="ETH 0.1"
                step="0.01"
                className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
                <h4 className="font-epilogue font-semibold text-[14px] leading-[22px] text-white">Back it because you believe in it.</h4>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Support the project for no reward, just because it speaks to you.</p>
                <p className="mt-[20px] font-epilogue font-normal leading-[22px] text-[#808191]">Contribute {state.minContribution} or above to become Approver.</p>


              </div>

              <CustomButton 
                btnType="button"
                title="Fund Campaign"
                styles="w-full bg-[#8c6dfd] mb-1"
                handleClick={handleDonate}
              />
            </div>
          </div>
        </div>
):
null
}

{/* {isOwner && created == false  && parseFloat(state.amountCollected)== parseFloat(state.target) ?(
              
              <div className="mt-1">
              <CustomButton 
                btnType="button"
                title="Create WithDrawRequest"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleWithdrawRequest}
              />
              </div>):              
              <div className="mt-1">
              <CustomButton 
                btnType="button"
                title="Created WithDrawRequest"
                styles="w-full bg-[#8c6dfd]"
              />
              </div>} */}

{isOwner && (state.amountCollected == state.target || state.deadline < timestamp)  ? (
              
              <div className="mt-1">
              <CustomButton 
                btnType="button"
                title="Create WithDrawRequest"
                styles="w-full bg-[#8c6dfd]"
                handleClick={handleWithdrawRequest}
              />
              </div>): null}
 {/* Hiral end */}
      </div>
    </div>
  )
}

export default CampaignDetails