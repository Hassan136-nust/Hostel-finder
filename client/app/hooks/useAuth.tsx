"use client";

import { useEffect } from "react";
import { useLoadUserQuery, useRefreshTokenQuery } from "../redux/features/api/apiSlice";
import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user } = useSelector((state: any) => state.auth);
  
  const { refetch: refreshToken } = useRefreshTokenQuery({}, {
    skip: false,
  });
  
  const { isLoading, refetch: refetchUser } = useLoadUserQuery({}, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        await refreshToken();
        await new Promise(resolve => setTimeout(resolve, 100));
        await refetchUser();
      } catch (error) {
        console.log("Auth initialization error:", error);
      }
    };

    initAuth();
  }, []); 

  return { user, isLoading, refetchUser };
};