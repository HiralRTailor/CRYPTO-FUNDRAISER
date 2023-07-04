// Added this file to show modal for switching Network
import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context';
import Modal from 'react-modal';
import CustomButton from './CustomButton';

const SwitchChainModal = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { switchToSepolia } = useStateContext();

  useEffect(() => {
    const handleModal = () => {
      if (parseInt(window?.ethereum?.chainId, 16) !== 11155111) {
        setModalIsOpen(true);
      } else if (parseInt(window?.ethereum?.chainId, 16) === 11155111) {
        setModalIsOpen(false);
      }
      // handleModal();
    };
    window?.ethereum?.on('chainChanged', () => {
      handleModal();
    });
  }, [window?.ethereum?.chainId]);

  return (
    <Modal
      isOpen={modalIsOpen}
      className={`absolute inset-0 flex items-center justify-center flex-col bg-[#131212] backdrop-filter backdrop-blur-xl bg-opacity-20 p-12 transition-all-[450ms]`}
      overlayClassName="Overlay"
    >
      <p className="font-epilogue font-bold text-3xl text-white mb-6 text-center">
        You're on a different network. Switch to Sepolia Testnet.
      </p>
      <CustomButton
        btnType="button"
        title={'Switch To Sepolia'}
        styles={'bg-gradient-to-r from-[#8c6dfd] to-[#d47c34] mr-3'}
        handleClick={switchToSepolia}
      />
    </Modal>
  );
};

export default SwitchChainModal;
