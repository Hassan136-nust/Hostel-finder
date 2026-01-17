"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useActivationMutation } from "@/redux/features/auth/authApi";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
};

type VerifyNumber = {
  "0": string;
  "1": string;
  "2": string;
  "3": string;
};

const Verification: FC<Props> = ({ open, setOpen, setRoute }) => {
  const { token } = useSelector((state: any) => state.auth);
  const [activation, { isSuccess, error }] = useActivationMutation();
  const [invalidError, setInvalidError] = useState<boolean>(false);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Account activated successfully");
      setRoute("Login");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
        setInvalidError(true);
      }
    }
  }, [isSuccess, error, setRoute]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const [verifyNumber, setVerifyNumber] = useState<VerifyNumber>({
    0: "",
    1: "",
    2: "",
    3: "",
  });

  const verificationHandler = async () => {
    const verificationNumber = Object.values(verifyNumber).join("");
    if (verificationNumber.length !== 4) {
      setInvalidError(true);
      return;
    }
    await activation({
      activation_token: token,
      activation_code: verificationNumber,
    });
  };

  const handleInputChange = (index: number, value: string) => {
    setInvalidError(false);
    const newVerifyNumber = { ...verifyNumber, [index]: value };
    setVerifyNumber(newVerifyNumber);

    if (value === "" && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            className="
              relative w-full max-w-[500px] 
              rounded-[2.5rem] shadow-2xl overflow-hidden
              bg-modal-bg text-modal-text
              p-8 md:p-10
              transition-all duration-500
            "
          >
            <button
              onClick={() => setOpen(false)}
              className="
                absolute top-6 right-6 p-2 rounded-full
                hover:bg-white/10 dark:hover:bg-black/10
                transition-colors z-10
              "
            >
              <HiX size={24} className="text-inherit" />
            </button>

            <div className="w-full flex flex-col items-center justify-center">
              <div className="w-[80px] h-[80px] rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
                <VscWorkspaceTrusted size={40} className="text-blue-500" />
              </div>
              
              <h1 className="text-2xl font-heading font-bold text-center mb-2">
                Verify Your Account
              </h1>
              <p className="text-center opacity-70 mb-8 font-body text-sm">
                We have sent a 4-digit activation code to your email.
              </p>

              <div className="w-full flex items-center justify-center gap-4 mb-8">
                {Object.keys(verifyNumber).map((key, index) => (
                  <input
                    type="number"
                    key={key}
                    ref={inputRefs[index]}
                    className={`
                      w-[65px] h-[65px] rounded-[16px] flex items-center justify-center
                      text-[24px] font-bold text-center outline-none
                      bg-white/10 dark:bg-black/5
                      border ${
                        invalidError
                          ? "border-red-500 shake"
                          : "border-white/10 dark:border-black/10"
                      }
                      focus:border-white/40 dark:focus:border-black/40
                      text-inherit transition-all font-body appearance-none
                    `}
                    maxLength={1}
                    value={verifyNumber[key as keyof VerifyNumber]}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
                ))}
              </div>

              <button
                onClick={verificationHandler}
                className="
                  w-full py-4 rounded-2xl font-heading font-bold
                  bg-[var(--modal-text)] text-[var(--modal-bg)]
                  shadow-xl hover:scale-[1.02] active:scale-[0.97]
                  transition-transform
                "
              >
                Verify OTP
              </button>

              <p className="mt-6 text-center text-[12px] opacity-60 font-body">
                Go back to{" "}
                <span
                  className="font-bold cursor-pointer hover:underline underline-offset-4"
                  onClick={() => setRoute("Login")}
                >
                  Login
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Verification;