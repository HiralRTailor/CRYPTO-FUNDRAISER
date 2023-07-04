import React from 'react';
import { useNavigate } from 'react-router-dom';

import FundCard from './FundCard';
import { loader } from '../assets';

const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();

  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign })
  }
  
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">{title} ({campaigns.length})</h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campigns yet
          </p>
        )}

        {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => <FundCard 
          key={campaign.id}
          {...campaign}
          handleClick={() => handleNavigate(campaign)}
        />)}
      </div>
    </div>
  )
}

export default DisplayCampaigns
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// import FundCard from './FundCard';
// import { loader } from '../assets';

// const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
//   const navigate = useNavigate();
//   const [searchTerm, setSearchTerm] = useState('');

//   const handleNavigate = (campaign) => {
//     navigate(`/campaign-details/${campaign.title}`, { state: campaign });
//   };

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const filteredCampaigns = campaigns.filter((campaign) => {
//     const campaignTitle = campaign.title.toLowerCase();
//     const searchQuery = searchTerm.toLowerCase();
//     return campaignTitle.includes(searchQuery);
//   });

//   return (
//     <div>
//       <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
//         {title} ({filteredCampaigns.length})
//       </h1>

//       <div className="flex flex-wrap mt-[20px] gap-[26px]">
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Search campaigns..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="border border-gray-300 rounded px-2 py-1"
//           />
//         </div>

//         {isLoading && (
//           <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
//         )}

//         {!isLoading && campaigns.length === 0 && (
//           <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
//             You have not created any campaigns yet
//           </p>
//         )}

//         {!isLoading && filteredCampaigns.length === 0 && (
//           <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
//             No campaigns found
//           </p>
//         )}

//         {!isLoading && filteredCampaigns.length > 0 && filteredCampaigns.map((campaign) => (
//           <FundCard
//             key={campaign.id}
//             {...campaign}
//             handleClick={() => handleNavigate(campaign)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default DisplayCampaigns;
