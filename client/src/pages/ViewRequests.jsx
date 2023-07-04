import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useStateContext } from '../context';
import { CountBox, CustomButton, Loader } from '../components';
import { normalizeAmount } from '@thirdweb-dev/sdk';
import { ethers } from 'ethers';
import { NotificationManager } from 'react-notifications';



const ViewRequests = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  // const [title, setTitle] = useState([]);
  // const [owner, setOwner] = useState([]);
  // const [approversCount, setCount] = useState([]);
  // const [approversTotal, setTotalCount] = useState([]);
  const [title, setTitles] = useState([]);
  const [owner, setOwners] = useState([]);
  const [approversCount, setApproversCounts] = useState([]);
  const [approversTotal, setApproversTotals] = useState([]);


  const { contract, getWithdrawalRequests, approveWithdrawalRequest, getCampaignDetails, getApproverCount, getApprovers, executeWithdrawalRequest } = useStateContext();

  const fetchRequests = async () => {
    setIsLoading(false);
   
      const withdrawalRequests = await getWithdrawalRequests();
      console.log(withdrawalRequests)
      setRequests(withdrawalRequests);

      console.log("Status")
      // console.log(withdrawalRequests[0].executed)
      // for (let i = 0; i < withdrawalRequests.length; i++){
      // const pIdValues=withdrawalRequests[i].pId;
      // console.log(pIdValues)
      // }
      const titles = [];
      const owners = [];
      const approversCounts = [];
      const approversTotals = [];
      
  
      for (let i = 0; i < withdrawalRequests.length; i++) {
        const pIdValue = withdrawalRequests[i].pId;
        const details = await getCampaignDetails(pIdValue);
        console.log(titles)
        titles.push(details.titles);
        owners.push(details.owners);
        const approver_count = await getApproverCount(pIdValue);
        approversCounts.push(approver_count.toString());
        const approvers = await getApprovers(pIdValue);
        approversTotals.push(approvers.length);
      }
      
      setTitles(titles);
      setOwners(owners);
      setApproversCounts(approversCounts);
      setApproversTotals(approversTotals);
    };

      // const pIdValue=withdrawalRequests[0].pId;
      // // console.log(pIdValue);
      // const details = await getCampaignDetails(pIdValue);
      // //console.log(details);
      // setTitle(details.titles); 
      // setOwner(details.owners)

      // const approver_count = await getApproverCount(pIdValue);
      // setCount(approver_count.toString())
      // // console.log(approver_count);
      // // console.log("approversCount")

      // // console.log(approversCount.toString())


      // const approvers = await getApprovers(pIdValue);
      // setTotalCount(approvers.length)
      // console.log(approvers);
      // console.log("approverstotal")

      // console.log(approvers.length)



  // };
  // console.log(title)

  // Handle approve 
  const handleApprove = async(requestId, ownerAddress) => 
  {
    if (window.ethereum) {
      // Request access to the user's accounts
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    
      // Get the provider and the signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
    
      // Get the connected wallet address
      const currentUserAddress = await signer.getAddress();
    
      // Use the currentUserAddress as needed
      console.log(currentUserAddress);
    
    // console.log("requestId")
    // console.log(requestId)
    const withdrawalRequests = await getWithdrawalRequests();
    const approvers = await getApprovers(requestId);
    const isApprover = approvers.some(approver => approver.approvers === currentUserAddress.toString());
    console.log(approvers.includes(currentUserAddress))
    console.log(approvers)
    console.log(currentUserAddress)
    const isOwner = currentUserAddress.toLowerCase() === ownerAddress.toLowerCase();
    if (isOwner) {
      // The current user is the owner of the campaign
      NotificationManager.warning('Current user is the owner and owner cannot approve request');
    } 
    else {  
      if (isApprover){ 
      // The current user is not the owner of the campaign
      const approvals = await approveWithdrawalRequest(requestId);
      console.log(approvals)
      NotificationManager.warning('Current user is approver of the Campaign');
    }
    else{
      NotificationManager.warning('Only approvers can approve withdraw request');
    }
  }
  }
    
    // catch(error)
    // {
    //   NotificationManager.warning(error.message);

    // }
  };
  
    // Handle Finalize 
    const handleFinalize = async(requestId, ownerAddress) => {
      if (window.ethereum) {
        // Request access to the user's accounts
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      
        // Get the provider and the signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
      
        // Get the connected wallet address
        const currentUserAddress = await signer.getAddress();
      
        // Use the currentUserAddress as needed
        console.log("currentUserAddress");
        console.log(currentUserAddress);
      
      // console.log("requestId")
      // console.log(requestId)
      //const ownerAddress = owner[requestId]; // Assuming 'owner' is an array containing owner addresses for each request
      console.log("ownerAddress")

      console.log(ownerAddress)
      const isOwner = currentUserAddress.toLowerCase() === ownerAddress.toLowerCase();
      if (isOwner) {
          // The current user is not the owner of the campaign
          const currentstatus = await executeWithdrawalRequest(requestId);
          console.log(currentstatus)
          // NotificationManager.warning('Current user is the owner',3000)
  
      } else {
        // The current user is the owner of the campaign
        NotificationManager.warning('Only owner can execute withdrawal ',3000);
      }
    }
    };

  useEffect(() => {
    if (contract) fetchRequests();
    else (console.log("no contract"))
  }, [contract]);

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">View Withdraw Request</h1>
      </div>

      <div className="mt-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign Title
                </th>

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipient Address
                </th>

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approval Count
                </th>

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Approve
                </th>

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Withdraw Finalize
                </th>

                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-wrap">{title[index]}</td>
                      <td className="px-6 py-4 whitespace-wrap">{request.reason}</td>
                      <td className="px-6 py-4 whitespace-wrap">{request.amount}</td>
                      <td className="px-6 py-4 whitespace-wrap">{request.payee}</td>
                      <td className="px-6 py-4 whitespace-wrap">{approversCount[index]}/{approversTotal[index]}</td>
                      <td className="px-6 py-4 whitespace-wrap">
                          {/* Approve button or Approved status */}
                          {request.executed ? (
                            <span className="text-green-500">Approved</span>
                          ) : (
                            <div className="mt-1">
                              <CustomButton 
                                btnType="button"
                                title="Approve"
                                styles="w-full bg-[#8c6dfd]"
                                width="px-0"
                                handleClick={() => handleApprove(request.pId,  owner[index])}
                              />
                            </div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-wrap">
                          {/* Withdraw Finalize button or Executed status */}
                          {request.executed ? (
                            <span className="text-green-500">Finalized</span>
                          ) : (
                            <div className="mt-1">
                              <CustomButton 
                                btnType="button"
                                title="Finalize"
                                styles="w-full bg-[#8c6dfd]"
                                width="px-0"
                                handleClick={() => handleFinalize(request.pId, owner[index])}
                              />
                            </div>
                          )}
                      </td>

                      <td className="px-6 py-4 whitespace-wrap">{request.executed ? 'Executed' : 'Not Executed'}</td>

                    </tr>
                  ))}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewRequests;
