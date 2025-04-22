import { createContext, useState, useContext } from "react";
import { useEffect } from "react";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [topic, setTopic] = useState(localStorage.getItem("topic"));
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isLogin, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showMenu, setShowMenu] = useState(false);

  // 🔁 This useEffect will run when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
    } else {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={{ topic, setTopic,isLogin, setIsLoggedIn,token,setToken, showMenu, setShowMenu}}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easy access
export const useAppContext = () => useContext(AppContext);
