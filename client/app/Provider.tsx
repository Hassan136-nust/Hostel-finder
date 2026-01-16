'use client';

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useLoadUserQuery } from "./redux/features/api/apiSlice";

interface ProviderProps {
  children: React.ReactNode;
}

const LoadUser = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useLoadUserQuery({}, {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  return <>{children}</>;
};

export function Providers({ children }: ProviderProps) {
  return (
    <Provider store={store}>
      <LoadUser>
        {children}
      </LoadUser>
    </Provider>
  );
}