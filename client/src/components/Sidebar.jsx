//Hiral
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStateContext } from '../context';
import { logo, sun, moon, logout } from '../assets';
import { navlinks, linkMap } from '../constants';
import { NotificationManager } from 'react-notifications';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div
    className={`w-[48px] h-[48px] rounded-[10px] ${isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`}
    onClick={handleClick}
  >
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
);

const Sidebar = () => {
  const { disconnect, address } = useStateContext();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const [isActive, setIsActive] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true); // true for dark mode, false for light mode

  useEffect(() => {
    const active = linkMap.get(pathname);
    if (active) setIsActive(active);
  }, [pathname]);

  return (
    <div className={`flex justify-between items-center flex-col sticky top-5 h-[93vh] `}>
      <Icon
        styles="w-[52px] h-[52px] bg-[#2c2f32]"
        imgUrl={logo}
        handleClick={() => {
          if (!address) {
            NotificationManager.error('Please connect your metamask account first', 'Wallet Not Connected', 2000);
            return;
          } else {
            navigate('/');
          }
        }}
      />

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-5">
          {navlinks.map((link) => (
            <Icon
              title={link.name}
              key={link.name}
              {...link}
              isActive={isActive}
              handleClick={() => {
                if (!address) {
                  NotificationManager.error('Please connect your metamask account first', 'Wallet Not Connected', 2000);
                  return;
                }
                if (!link.disabled) {
                  setIsActive(link.name);
                  navigate(link.link);
                  if (link.name === 'logout') {
                    disconnect();
                    navigate('/');
                    setIsActive('home');
                  }
                }
              }}
            />
          ))}
        </div>

{/* <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} /> */}

      </div>
    </div>
  );
};

export default Sidebar;
