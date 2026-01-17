"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { HiX } from "react-icons/hi";
import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import signupAnimation from "../../assets/json/Sign.json";
import { useDispatch } from "react-redux";
import { userRegistration } from "@/redux/features/auth/authSlice";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Please enter your name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password").min(6),
  phone: Yup.string().required("Please enter your phone number").min(10),
});

const SignUp = ({ open, setOpen, setRoute }: Props) => {
  const [show, setShow] = useState(false);
  const [register, { data, error, isSuccess, isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      const message = data?.message || "Registration successful";
      toast.success(message);
      setRoute("Verification");
      if (data?.activationToken) {
        dispatch(userRegistration({ token: data.activationToken }));
      }
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  }, [isSuccess, error, data, setRoute, dispatch]);

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", phone: "" },
    validationSchema: schema,
    onSubmit: async ({ name, email, password, phone }) => {
      const data = { name, email, password, phone };
      await register(data);
    },
  });

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
            className="
              relative w-full max-w-[900px] min-h-[550px]
              rounded-[2.5rem] shadow-2xl overflow-hidden
              flex flex-col md:flex-row z-[1001]
              bg-modal-bg text-modal-text
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
              <div className="mb-3">
                <h1 className="text-4xl font-heading font-bold">
                  Create Account
                </h1>
                <p className="mt-2 text-sm opacity-70 font-body">
                  Join Hostelite and find your perfect stay today.
                </p>
              </div>

              <form className="space-y-2" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`
                      w-full px-5 py-3.5 rounded-2xl outline-none
                      bg-white/10 dark:bg-black/5
                      border ${
                        errors.name && touched.name
                          ? "border-red-500"
                          : "border-white/10 dark:border-black/10"
                      }
                      focus:border-white/40 dark:focus:border-black/40
                      text-inherit placeholder:text-inherit placeholder:opacity-30
                      transition-all font-body
                    `}
                  />
                  {errors.name && touched.name && (
                    <span className="text-red-500 text-xs block">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                    Phone Number
                  </label>
                  <input
                    type="number"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={`
                      w-full px-5 py-3.5 rounded-2xl outline-none
                      bg-white/10 dark:bg-black/5
                      border ${
                        errors.phone && touched.phone
                          ? "border-red-500"
                          : "border-white/10 dark:border-black/10"
                      }
                      focus:border-white/40 dark:focus:border-black/40
                      text-inherit placeholder:text-inherit placeholder:opacity-30
                      transition-all font-body appearance-none
                    `}
                  />
                  {errors.phone && touched.phone && (
                    <span className="text-red-500 text-xs block">
                      {errors.phone}
                    </span>
                  )}
                </div>

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
                    className={`
                      w-full px-5 py-3.5 rounded-2xl outline-none
                      bg-white/10 dark:bg-black/5
                      border ${
                        errors.email && touched.email
                          ? "border-red-500"
                          : "border-white/10 dark:border-black/10"
                      }
                      focus:border-white/40 dark:focus:border-black/40
                      text-inherit placeholder:text-inherit placeholder:opacity-30
                      transition-all font-body
                    `}
                  />
                  {errors.email && touched.email && (
                    <span className="text-red-500 text-xs block">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[11px] font-bold uppercase tracking-widest opacity-80">
                    Password
                  </label>
                  <input
                    type={show ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`
                      w-full px-5 py-3.5 rounded-2xl outline-none
                      bg-white/10 dark:bg-black/5
                      border ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : "border-white/10 dark:border-black/10"
                      }
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
                  {errors.password && touched.password && (
                    <span className="text-red-500 text-xs block pt-1">
                      {errors.password}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="
                    w-full py-4 rounded-2xl font-heading font-bold
                    bg-[var(--modal-text)] text-[var(--modal-bg)]
                    shadow-xl hover:scale-[1.02] active:scale-[0.97]
                    transition-transform mt-2 disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SignUp;