"use client";

import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import signupAnimation from "../../assets/json/Sign.json";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useRegisterMutation, useActivateMutation } from "@/app/redux/features/auth/authApi";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
}

interface ErrorData {
  data: {
    message: string;
  };
}

const SignUp = ({ open, setOpen, setRoute }: Props) => {
  const [show, setShow] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [activationToken, setActivationToken] = useState("");
  const [toastId, setToastId] = useState<string | null>(null);

  const [register, { isSuccess: registerSuccess, error: registerError, data: registerData }] = useRegisterMutation();
  const [activate, { isSuccess: activateSuccess, error: activateError }] = useActivateMutation();

  const registerSchema = Yup.object().shape({
    name: Yup.string().required("Please enter your name!"),
    email: Yup.string().email("Invalid email!").required("Please enter your email!"),
    phone: Yup.string()
      .required("Please enter your phone number!")
      .matches(/^[0-9+\s-()]+$/, "Phone number must contain only numbers and valid symbols")
      .min(10, "Phone number must be at least 10 digits"),
    password: Yup.string().required("Please enter your password!").min(6, "Password must be at least 6 characters"),
  });

  const verificationSchema = Yup.object().shape({
    verificationCode: Yup.string().required("Please enter the verification code!").length(4, "Code must be 4 digits"),
  });

  const registerFormik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "" },
    validationSchema: registerSchema,
    onSubmit: async ({ name, email, phone, password }) => {
      const data = { name, email, phone, password };
      const id = toast.loading("Creating your account...");
      setToastId(id);
      await register(data);
    },
  });

  const verificationFormik = useFormik({
    initialValues: { verificationCode: "" },
    validationSchema: verificationSchema,
    onSubmit: async ({ verificationCode }) => {
      const id = toast.loading("Verifying your account...");
      setToastId(id);
      await activate({
        activation_token: activationToken,
        activation_code: verificationCode,
      });
    },
  });

  useEffect(() => {
    if (registerSuccess && registerData) {
      toast.success(registerData.message || "Account created");
      setActivationToken(registerData.activationToken);
      setIsVerification(true);
    }
    if (registerError && toastId) {
      if ("data" in registerError) {
        const errorData = registerError as ErrorData;
      toast.error(errorData.data.message, { id: toastId });
      }else {
        toast.error("Something went wrong!", { id: toastId });
      }
    }
  }, [registerSuccess, registerError, registerData]);

  useEffect(() => {
    if (activateSuccess && toastId) {
      toast.success("Account activated successfully! Please login." , { id: toastId });
      setIsVerification(false);
      setOpen(false);
      setRoute("Login");
    }
    if (activateError && toastId) {
      if ("data" in activateError) {
        const errorData = activateError as ErrorData;
        toast.error(errorData.data.message, { id: toastId });
      }else { 
        toast.error("Something went wrong!", { id: toastId });
      }
    }
  }, [activateSuccess, activateError]);

  const { errors: registerErrors, touched: registerTouched, values: registerValues, handleChange: registerHandleChange, handleSubmit: registerHandleSubmit } = registerFormik;

  const { errors: verifyErrors, touched: verifyTouched, values: verifyValues, handleChange: verifyHandleChange, handleSubmit: verifyHandleSubmit } = verificationFormik;

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
              relative w-full max-w-[900px] min-h-[550px]
              rounded-[2.5rem] shadow-2xl overflow-hidden
              flex flex-col md:flex-row z-[1001]
              bg-modal-bg text-modal-text
              transition-all duration-500
            "
          >
            <button
              onClick={() => {
                setOpen(false);
                setIsVerification(false);
              }}
              className="
                absolute top-6 right-6 p-2 rounded-full
                hover:bg-white/10 dark:hover:bg-black/10
                transition-colors z-10
              "
            >
              <HiX size={24} className="text-inherit" />
            </button>

            <div
              className="
                hidden md:flex w-1/2
                bg-white/5 dark:bg-black/5
                items-center justify-center p-8
                border-r border-white/10 dark:border-black/10
              "
            >
              <Lottie
                animationData={signupAnimation}
                loop
                className="w-full max-w-[320px]"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              {!isVerification ? (
                <>
                  <div className="mb-3">
                    <h1 className="text-4xl font-heading font-bold">
                      Create Account
                    </h1>
                    <p className="mt-2 text-sm opacity-70 font-body">
                      Join Hostelite and find your perfect stay today.
                    </p>
                  </div>

                  <form className="space-y-2" onSubmit={registerHandleSubmit}>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={registerValues.name}
                        onChange={registerHandleChange}
                        placeholder="John Doe"
                        className={`
                          w-full px-5 py-3.5 rounded-2xl outline-none
                          bg-white/10 dark:bg-black/5
                          border ${registerErrors.name && registerTouched.name ? "border-red-500" : "border-white/10 dark:border-black/10"}
                          focus:border-white/40 dark:focus:border-black/40
                          text-inherit placeholder:text-inherit placeholder:opacity-30
                          transition-all font-body
                        `}
                      />
                      {registerErrors.name && registerTouched.name && (
                        <span className="text-red-500 pt-1 block text-xs">{registerErrors.name}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={registerValues.email}
                        onChange={registerHandleChange}
                        placeholder="name@example.com"
                        className={`
                          w-full px-5 py-3.5 rounded-2xl outline-none
                          bg-white/10 dark:bg-black/5
                          border ${registerErrors.email && registerTouched.email ? "border-red-500" : "border-white/10 dark:border-black/10"}
                          focus:border-white/40 dark:focus:border-black/40
                          text-inherit placeholder:text-inherit placeholder:opacity-30
                          transition-all font-body
                        `}
                      />
                      {registerErrors.email && registerTouched.email && (
                        <span className="text-red-500 pt-1 block text-xs">{registerErrors.email}</span>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={registerValues.phone}
                        onChange={registerHandleChange}
                        placeholder="+92 300 1234567"
                        className={`
                          w-full px-5 py-3.5 rounded-2xl outline-none
                          bg-white/10 dark:bg-black/5
                          border ${registerErrors.phone && registerTouched.phone ? "border-red-500" : "border-white/10 dark:border-black/10"}
                          focus:border-white/40 dark:focus:border-black/40
                          text-inherit placeholder:text-inherit placeholder:opacity-30
                          transition-all font-body
                        `}
                      />
                      {registerErrors.phone && registerTouched.phone && (
                        <span className="text-red-500 pt-1 block text-xs">{registerErrors.phone}</span>
                      )}
                    </div>

                    <div className="space-y-1.5 relative">
                      <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                        Password
                      </label>
                      <input
                        type={show ? "text" : "password"}
                        name="password"
                        value={registerValues.password}
                        onChange={registerHandleChange}
                        placeholder="••••••••"
                        className={`
                          w-full px-5 py-3.5 rounded-2xl outline-none
                          bg-white/10 dark:bg-black/5
                          border ${registerErrors.password && registerTouched.password ? "border-red-500" : "border-white/10 dark:border-black/10"}
                          focus:border-white/40 dark:focus:border-black/40
                          text-inherit placeholder:text-inherit placeholder:opacity-30
                          transition-all font-body
                        `}
                      />
                      <div
                        className="absolute right-5 bottom-3.5 cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                        onClick={() => setShow(!show)}
                      >
                        {show ? (
                          <AiOutlineEye size={22} />
                        ) : (
                          <AiOutlineEyeInvisible size={22} />
                        )}
                      </div>
                      {registerErrors.password && registerTouched.password && (
                        <span className="text-red-500 pt-1 block text-xs">{registerErrors.password}</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="
                        w-full py-4 rounded-2xl font-heading font-bold
                        bg-[var(--modal-text)] text-[var(--modal-bg)]
                        shadow-xl hover:scale-[1.02] active:scale-[0.97]
                        transition-transform mt-2
                      "
                    >
                      Sign Up
                    </button>
                  </form>

                  <div className="mt-3">
                    <div className="relative flex items-center justify-center mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10 dark:border-black/10" />
                      </div>
                      <span
                        className="
                          relative px-2 text-[10px] uppercase tracking-[0.25em]
                          font-bold opacity-50
                          bg-[var(--modal-bg)]
                        "
                      >
                        Or join with
                      </span>
                    </div>

                    <button
                      className="
                        w-full flex items-center justify-center gap-3
                        py-3 rounded-2xl
                        bg-white/10 dark:bg-black/5
                        border border-white/10 dark:border-black/10
                        hover:bg-white/20 dark:hover:bg-black/10
                        transition-all
                      "
                    >
                      <FcGoogle size={22} />
                      <span className="text-xs font-bold uppercase tracking-widest">
                        Google Account
                      </span>
                    </button>
                  </div>

                  <p className="mt-3 text-center text-[12px] opacity-60 font-body">
                    Already have an account?{" "}
                    <span
                      className="font-bold cursor-pointer hover:underline underline-offset-4"
                      onClick={() => setRoute("Login")}
                    >
                      Login here
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <h1 className="text-4xl font-heading font-bold">
                      Verify Email
                    </h1>
                    <p className="mt-2 text-sm opacity-70 font-body">
                      Enter the 4-digit code sent to your email
                    </p>
                  </div>

                  <form className="space-y-5" onSubmit={verifyHandleSubmit}>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        name="verificationCode"
                        value={verifyValues.verificationCode}
                        onChange={verifyHandleChange}
                        placeholder="0000"
                        maxLength={4}
                        className={`
                          w-full px-5 py-4 rounded-2xl outline-none text-center text-2xl tracking-widest
                          bg-white/10 dark:bg-black/5
                          border ${verifyErrors.verificationCode && verifyTouched.verificationCode ? "border-red-500" : "border-white/10 dark:border-black/10"}
                          focus:border-white/40 dark:focus:border-black/40
                          text-inherit placeholder:text-inherit placeholder:opacity-30
                          transition-all font-mono
                        `}
                      />
                      {verifyErrors.verificationCode && verifyTouched.verificationCode && (
                        <span className="text-red-500 pt-1 block text-xs text-center">{verifyErrors.verificationCode}</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="
                        w-full py-4 rounded-2xl font-heading font-bold
                        bg-[var(--modal-text)] text-[var(--modal-bg)]
                        shadow-xl hover:scale-[1.02] active:scale-[0.97]
                        transition-transform
                      "
                    >
                      Verify Account
                    </button>
                  </form>

                  <p className="mt-6 text-center text-[12px] opacity-60 font-body">
                    Didn't receive the code?{" "}
                    <span
                      className="font-bold cursor-pointer hover:underline underline-offset-4"
                      onClick={() => {
                        setIsVerification(false);
                        registerFormik.handleSubmit();
                      }}
                    >
                      Resend Code
                    </span>
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignUp;