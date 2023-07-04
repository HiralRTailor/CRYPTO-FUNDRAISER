import React, { useContext, createContext, useEffect } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useDisconnect } from '@thirdweb-dev/react';//hiral
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

//added by Hral to check if the user is on sepolia or not?
const Sepolia_CHAIN_ID = 11155111;
const Sepolia_RPC_URL = 'https://rpc.ankr.com/eth_sepolia';  

const StateContext = createContext();
export const StateContextProvider = ({ children }) => {
  // const { contract } = useContract('0x8f2bc6f1F221964ED04b34AE9aB4401Fc8866b57');
  //Secondlast Last Working - const { contract } = useContract('0x3695368DF66c8b891E86E8c74222d2F32Bc447F8');5
  
  //Last Working - const { contract } = useContract('0xaf6EeD5e61BE0936BDE7fc347a218230FA661E9e');6
 // const { contract } = useContract('0x460A7495F0b1F442e855912629AA478Bc00f98D3');7
  //7 2
  const { contract } = useContract('0x235B9315CefA4Fee207bEf8a6Dad06d2B85646F6');

  const { mutateAsync: createCampaign } = useContractWrite(contract, 'createCampaign');
  const { mutateAsync: createWithdrawalRequest } = useContractWrite(contract, 'createWithdrawalRequest');


  const address = useAddress();
  const connect = useMetamask();
  const disconnect = useDisconnect();//hiral

  const publishCampaign = async (form) => {
    console.log({form})
    try {
      const data = await contract.call('createCampaign', [
        address, // owner
        form.title, // title
        form.description, // description
        form.target, //target
        
        new Date(form.deadline).getTime(), // deadline,
        form.image, //image,
        form.minContribution,// minContribution
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const publishWithdrawRequest = async (form) => {
    console.log({form});
    try {
      const data = await contract.call('createWithdrawalRequest', [
        form.pId, 
        form.withdrawamount, //amount
        form.reason,
        form.payee,// payee
      ])

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getCampaigns = async () => {
    const campaigns = await contract.call('getCampaigns');

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      minContribution: ethers.utils.formatEther(campaign.minContribution.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i,
      key: i // added by Hiral
    }));

    return parsedCampaings;
  }

  const getWithdrawalRequests = async () => {
    const withdrawalRequests = await contract.call('getWithdrawalRequests');
    // Process the withdrawal requests data here
    // console.log("withdrawalRequests");
    // console.log(withdrawalRequests);

    const parsedRequests = withdrawalRequests.map((request, i) => ({
      // id : request.pId.toString(),
      reason : request.reason,
      amount : ethers.utils.formatEther(request.amount.toString()),
      payee : request.payee,
      pId: i,
      key: i ,// added by Hiral
      executed: request.executed
    }));

    return parsedRequests;

    // return withdrawalRequests;
  };

  const approveWithdrawalRequest = async (pId) => {
    console.log(pId)
    const approves = await contract.call('approveWithdrawalRequest', pId.toString());

    console.log(approves)
    return approves;
  }
  // Get the count of approvers who approved the withdrawal request

  const getApproverCount = async (pId) => {
    console.log(pId)
    const approves_count = await contract.call('getApproverCount', pId.toString());

    console.log(approves_count)
    return approves_count;
  }



  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    // Commented by Hiral
    // const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});
    const data = await contract.call('donateToCampaign', pId.toString(), { value: ethers.utils.parseEther(amount)});
    return data;
  }

  const getDonations = async (pId) => {
    // Commented by Hiral
    // const donations = await contract.call('getDonators', pId);
    const donations = await contract.call('getDonators', pId.toString());
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  const getCampaignDetails = async (pId) => {
    const campaignDetails = await contract.call('getCampaignDetails',pId.toString());
    // console.log(campaignDetails)
    // const [owner, title, description, target, deadline, amountCollected, image, minContribution, withdrawalRequestCreated] = campaignDetails;
    const titles= campaignDetails[1];
    const owners= campaignDetails[0];
    const descriptions= campaignDetails[2];
    const targets= campaignDetails[3];
    const deadlines= campaignDetails[4];
    const amountCollecteds= campaignDetails[5];
    const images = campaignDetails[6];
    const minContributions = campaignDetails[7];
    const withdrawalRequestCreateds = campaignDetails[8];

    // Return an object containing the campaign details
    return {
      owners,
      titles,
      descriptions,
      targets: Number(targets),
      deadlines: Number(deadlines),
      amountCollecteds: Number(amountCollecteds),
      images,
      minContributions: Number(minContributions),
      withdrawalRequestCreateds,
    };
  };
  
  const getApprovers = async (pId) => {
    console.log(pId)
      const approvals = await contract.call('getApprovers',pId.toString());
      const numberOfApprovals = approvals[0].length;

      const parsedApprovals = [];

    for(let i = 0; i < numberOfApprovals; i++) {
      parsedApprovals.push({
        approvers: approvals[0][i],
        approval: ethers.utils.formatEther(approvals[1][i].toString())
      })
    }

    return parsedApprovals;
  };

  const executeWithdrawalRequest = async (pId) => {
    console.log(pId)
    const status = await contract.call('executeWithdrawalRequest',pId.toString());
    console.log(status)

    return status;
  };


  //added by Hiral - Start - to check if we are using Sepolia or sepolia
  const switchToSepolia = async () => {
    try {
      await window?.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${Sepolia_CHAIN_ID.toString(16)}`,
          },
        ],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window?.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${Sepolia_CHAIN_ID.toString(16)}`,
                chainName: 'Sepolia Testnet',
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'SepoliaETH',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.ankr.com/eth_sepolia'],
                blockExplorerUrls: ['https://sepolia.etherscan.io/'],
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
    }
  };

  useEffect(() => {
    const switchChain = async () => {
      await switchToSepolia();
    };
    switchChain();

  }, []);
  //added by Hiral - End - to check if we are using Sepolia or sepolia

  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        disconnect,//hiral
        createCampaign: publishCampaign,
        createWithdrawalRequest: publishWithdrawRequest,
        getWithdrawalRequests,
        approveWithdrawalRequest,
        executeWithdrawalRequest,
        getApproverCount,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        getApprovers,
        getCampaignDetails,
        switchToSepolia //added by Hiral
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);