"use client";

import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import loginAnimation from "../../assets/json/Login.json";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useLoginMutation } from "@/app/redux/features/auth/authApi";

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

const Login = ({ open, setOpen, setRoute }: Props) => {
  const [show, setShow] = useState(false);
const [login, { isSuccess, error }] = useLoginMutation();

const schema = Yup.object().shape({
  email: Yup.string().email("Invalid email!").required("Please enter your email!"),
  password: Yup.string().required("Please enter your password!").min(6),
});

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      await login({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully!");
      setOpen(false);
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as ErrorData;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Overlay */}
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
    relative w-full max-w-[900px] min-h-[460px]
    rounded-[2.5rem] shadow-2xl overflow-hidden
    flex flex-col md:flex-row z-[1001]
    bg-modal-bg text-modal-text
    transition-all duration-500
  "
>

            {/* Close Button */}
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

            {/* Left Animation */}
            <div
              className="
                hidden md:flex w-1/2
                bg-white/5 dark:bg-black/5
                items-center justify-center p-8
                border-r border-white/10 dark:border-black/10
              "
            >
              <Lottie
                animationData={loginAnimation}
                loop
                className="w-full max-w-[300px]"
              />
            </div>

            {/* Right Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-4">
                <h1 className="text-4xl font-heading font-bold">
                  Welcome Back
                </h1>
                <p className="mt-2 text-sm opacity-70">
                  Please enter your details to sign in
                </p>
              </div>

             <form
                className="space-y-5"
                onSubmit={handleSubmit} // CHANGE: Use formik's handleSubmit
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email" // ADD: name attribute
                    value={values.email} // ADD: bind value
                    onChange={handleChange} // ADD: bind change handler
                    placeholder="name@example.com"
                    className={`
                      w-full px-5 py-4 rounded-2xl outline-none
                      bg-white/10 dark:bg-black/5
                      border ${errors.email && touched.email ? "border-red-500" : "border-white/10 dark:border-black/10"}
                      focus:border-white/40 dark:focus:border-black/40
                      text-inherit placeholder:text-inherit placeholder:opacity-30
                      transition-all
                    `}
                  />
                  {errors.email && touched.email && (
                    <span className="text-red-500 pt-1 block text-xs">{errors.email}</span>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                    Password
                  </label>
                  <input
                    type={show ? "text" : "password"}
                    name="password" // ADD: name attribute
                    value={values.password} // ADD: bind value
                    onChange={handleChange} // ADD: bind change handler
                    placeholder="••••••••"
                    className={`
                      w-full px-5 py-4 rounded-2xl outline-none
                      bg-white/10 dark:bg-black/5
                      border ${errors.password && touched.password ? "border-red-500" : "border-white/10 dark:border-black/10"}
                      focus:border-white/40 dark:focus:border-black/40
                      text-inherit placeholder:text-inherit placeholder:opacity-30
                      transition-all
                    `}
                  />
                  {/* ... (keep eye icon) */}
                  {errors.password && touched.password && (
                    <span className="text-red-500 pt-1 block text-xs">{errors.password}</span>
                  )}
                </div>

                {/* Login Button */}
                <button
                  type="submit" // ADD: ensure type is submit
                  className="
                    w-full py-4 rounded-2xl font-heading font-bold
                    bg-[var(--modal-text)] text-[var(--modal-bg)]
                    shadow-xl hover:scale-[1.02] active:scale-[0.97]
                    transition-transform
                  "
                >
                  Login
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10 dark:border-black/10" />
                  </div>
                  <span
                    className="
                      relative px-4 text-[10px] uppercase tracking-[0.25em]
                      font-bold opacity-50
                      bg-[var(--modal-bg)]
                    "
                  >
                    Or join with
                  </span>
                </div>

                {/* Google */}
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

              {/* Signup */}
              <p className="mt-10 text-center text-[12px] opacity-60">
                Not a member?{" "}
                <span
                  className="font-bold cursor-pointer hover:underline underline-offset-4"
                  onClick={() => setRoute("Sign-Up")}
                >
                  Sign Up Now
                </span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Login;
