"use client";

import { redirect } from "next/navigation";
import useAuth from "./useAuth";
import React from "react";

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const isAuthenticated = useAuth();

  return isAuthenticated ? <>{children}</> : redirect("/");
};

export default Protected;
