import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IHostel {
    _id: string;
    name: string;
    city: string;
    address: string;
    price?: number;
    minPrice?: number;
    rating: number;
    type: string; // Boys, Girls
    facilities: string[];
    images: { url: string }[];
}

interface ComparisonState {
    selectedHostels: IHostel[];
    isOpen: boolean; // For the modal
}

const initialState: ComparisonState = {
    selectedHostels: [],
    isOpen: false,
};

const comparisonSlice = createSlice({
    name: "comparison",
    initialState,
    reducers: {
        addToCompare: (state, action: PayloadAction<IHostel>) => {
            if (state.selectedHostels.length < 3) {
                const exists = state.selectedHostels.find(h => h._id === action.payload._id);
                if (!exists) {
                    state.selectedHostels.push(action.payload);
                }
            }
        },
        removeFromCompare: (state, action: PayloadAction<string>) => {
            state.selectedHostels = state.selectedHostels.filter(h => h._id !== action.payload);
        },
        clearComparison: (state) => {
            state.selectedHostels = [];
        },
        toggleComparisonModal: (state, action: PayloadAction<boolean>) => {
            state.isOpen = action.payload;
        },
    },
});

export const { addToCompare, removeFromCompare, clearComparison, toggleComparisonModal } = comparisonSlice.actions;
export default comparisonSlice.reducer;
