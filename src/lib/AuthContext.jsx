import React, { createContext, useState, useContext, useEffect } from "react";
import { appParams } from "@/lib/app-params";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
  }, []);

  const checkAppState = async () => {
    try {
      setIsLoadingPublicSettings(true);
      setAuthError(null);

      // SEM BASE44 -> não temos backend ainda
      setAppPublicSettings(null);

      setIsLoadingPublicSettings(false);

      if (appParams?.token) {
        await checkUserAuth();
      } else {
        setIsAuthenticated(false);
        setIsLoadingAuth(false);
        setAuthChecked(true);
      }
    } catch (error) {
      console.error(error);
      setAuthError({
        type: "unknown",
        message: "Failed to load app"
      });

      setIsLoadingAuth(false);
      setIsLoadingPublicSettings(false);
    }
  };

  const checkUserAuth = async () => {
    try {
      setIsLoadingAuth(true);

      // SEM BACKEND -> usuário fictício (ou null)
      const currentUser = null;

      setUser(currentUser);
      setIsAuthenticated(false);

      setIsLoadingAuth(false);
      setAuthChecked(true);
    } catch (error) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const navigateToLogin = () => {
    console.warn("Login not implemented (Base44 removed)");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};