import React, { createContext, useContext, useState, useEffect } from 'react';
import { Web3Provider } from './Web3Provider';

export const CreateContext = createContext();

export const useAppContext = () => useContext(CreateContext);

const Context = ({ children }) => {
  const [mobile, setMobile] = useState(true);
  const [rightBar, setRightBar] = useState(true);
  const [toggleTop, setToggle] = useState(true);
  const [toggleAuth, setToggleAuth] = useState(true);
  const [showItem, setShowItem] = useState(true);
  const [inputs, setInputs] = useState('');
  const [activeMobileMenu, setActiveMobileMenu] = useState(true);

  const checkScreenSize = () => {
    if (window.innerWidth < 1200) {
      setMobile(false);
      setRightBar(false);
    } else {
      setMobile(true);
      setRightBar(true);
    }
  };

  useEffect(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const shouldCollapseLeftbar = !mobile;
  const shouldCollapseRightbar = !rightBar;

  return (
    <Web3Provider>
      <CreateContext.Provider
        value={{
          mobile,
          setMobile,
          showItem,
          setShowItem,
          activeMobileMenu,
          setActiveMobileMenu,
          toggleTop,
          setToggle,
          toggleAuth,
          setToggleAuth,
          rightBar,
          setRightBar,
          shouldCollapseLeftbar,
          shouldCollapseRightbar,
          inputs,
          setInputs,
        }}
      >
        {children}
      </CreateContext.Provider>
    </Web3Provider>
  );
};

export default Context;
