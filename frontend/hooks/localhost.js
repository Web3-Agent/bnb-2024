import { useState, useEffect } from 'react';

function useLocalStorageIsNull(key) {
  const [isNull, setIsNull] = useState(null);

  useEffect(() => {
    const checkLocalStorageIsNull = () => {
      const value = localStorage.getItem(key);
      const isNull = value === 'null' || value === null;
      setIsNull(isNull);
    };

    checkLocalStorageIsNull();

    const handleStorageChange = (e) => {
      if (e.key === key) {
        checkLocalStorageIsNull();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return isNull;
}

export default useLocalStorageIsNull;
