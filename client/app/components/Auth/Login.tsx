"use client";

import React, { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
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
  const [toastId, setToastId] = useState<string | null>(null);

  const [login, { isSuccess, error, isLoading }] = useLoginMutation();

  const schema = Yup.object().shape({
    email: Yup.string().email("Invalid email!").required("Please enter your email!"),
    password: Yup.string().required("Please enter your password!").min(6),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async ({ email, password }) => {
      const id = toast.loading("Logging you in...");
      setToastId(id);
      await login({ email, password });
    },
  });

  useEffect(() => {
    if (isSuccess && toastId) {
      toast.success("Login successful! Welcome back 👋", { id: toastId });
      setOpen(false);
    }

    if (error && toastId) {
      if ("data" in error) {
        const errorData = error as ErrorData;
        toast.error(errorData.data.message || "Login failed", { id: toastId });
      } else {
        toast.error("Something went wrong!", { id: toastId });
      }
    }
  }, [isSuccess, error]);

  const { errors, touched, values, handleChange, handleSubmit } = formik;

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
            className="relative w-full max-w-[900px] min-h-[460px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row z-[1001] bg-modal-bg text-modal-text transition-all duration-500"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors z-10"
            >
              <HiX size={24} />
            </button>

            <div className="hidden md:flex w-1/2 bg-white/5 dark:bg-black/5 items-center justify-center p-8 border-r border-white/10 dark:border-black/10">
              <Lottie animationData={loginAnimation} loop className="w-full max-w-[300px]" />
            </div>

            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-4">
                <h1 className="text-4xl font-heading font-bold">Welcome Back</h1>
                <p className="mt-2 text-sm opacity-70">
                  Please enter your details to sign in
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full px-5 py-4 rounded-2xl outline-none bg-white/10 dark:bg-black/5 border ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-white/10 dark:border-black/10"
                    } focus:border-white/40 dark:focus:border-black/40 transition-all`}
                  />
                  {errors.email && touched.email && (
                    <span className="text-red-500 pt-1 block text-xs">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                    Password
                  </label>
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 rounded-2xl outline-none bg-white/10 dark:bg-black/5 border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-white/10 dark:border-black/10"
                    } focus:border-white/40 dark:focus:border-black/40 transition-all`}
                  />
                  {errors.password && touched.password && (
                    <span className="text-red-500 pt-1 block text-xs">
                      {errors.password}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl font-heading font-bold bg-[var(--modal-text)] text-[var(--modal-bg)] shadow-xl hover:scale-[1.02] active:scale-[0.97] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>

              <div className="mt-8">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10 dark:border-black/10" />
                  </div>
                  <span className="relative px-4 text-[10px] uppercase tracking-[0.25em] font-bold opacity-50 bg-[var(--modal-bg)]">
                    Or join with
                  </span>
                </div>

                <button className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white/10 dark:bg-black/5 border border-white/10 dark:border-black/10 hover:bg-white/20 dark:hover:bg-black/10 transition-all">
                  <FcGoogle size={22} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Google Account
                  </span>
                </button>
              </div>

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
