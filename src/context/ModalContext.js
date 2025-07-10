import React, { createContext, useEffect, useState } from 'react';
import Modal from 'react-modal';

export const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  content: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minHeight: '250px',
    height: 'fit-content',
    maxWidth: '750px',
    background: '#05506d',
    overflow: 'auto',
    WebkitOverflowScrolling: 'touch',
    outline: 'none',
    padding: '25px 10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#fff',
    justifyContent: 'center',
    fontSize: '14px',
    gap: '20px',
  },
};

export const ModalContext = createContext({
  handleClose: () => {},
  handleOpen: () => {},
  setContent: () => {},
  isOpen: false,
});

const ModalProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');

  const handleClose = () => {
    setContent('');
    setOpen((prev) => !prev);
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    Modal.setAppElement('#root');
  }, []);

  return (
    <ModalContext.Provider value={{ setContent, handleClose, handleOpen, isOpen: open }}>
      <Modal isOpen={open} onRequestClose={handleClose} style={customStyles}>
        {content}
      </Modal>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
