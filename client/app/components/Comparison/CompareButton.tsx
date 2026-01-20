"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineScale, HiCheck } from "react-icons/hi";
import { addToCompare, removeFromCompare } from "@/redux/features/comparison/comparisonSlice";
import { toast } from "react-hot-toast";

const CompareButton = ({ hostel }: { hostel: any }) => {
    const dispatch = useDispatch();
    const { selectedHostels } = useSelector((state: any) => state.comparison);
    
    // Check if this hostel is already added
    const isAdded = selectedHostels.some((h: any) => h._id === hostel._id);

    const handleCompare = (e: React.MouseEvent) => {
        e.preventDefault(); 
        
        if (isAdded) {
            dispatch(removeFromCompare(hostel._id));
        } else {
            if (selectedHostels.length >= 3) {
                toast.error("You can compare up to 3 hostels");
                return;
            }
            dispatch(addToCompare(hostel));
            toast.success("Added to comparison");
        }
    };

    return (
        <button
            onClick={handleCompare}
            className={`p-2 rounded-xl transition-all ${
                isAdded 
                    ? "bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13]" 
                    : "bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 text-[#2c1b13] dark:text-[#fcf2e9] hover:bg-[#2c1b13] dark:hover:bg-[#fcf2e9] hover:text-[#fcf2e9] dark:hover:text-[#2c1b13]"
            }`}
             title={isAdded ? "Remove from comparison" : "Add to comparison"}
        >
            {isAdded ? <HiCheck size={18} /> : <HiOutlineScale size={18} />}
        </button>
    );
};

export default CompareButton;
