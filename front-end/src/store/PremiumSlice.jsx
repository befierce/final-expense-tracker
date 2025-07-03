import { createSlice } from "@reduxjs/toolkit";

const initialPremiumState = {premium:false};


const premiumSlice = createSlice({
    name: 'premium',
    initialState: initialPremiumState,
    reducers:{
        setPremium(state){
            console.log("premium state triggered in store")
            state.premium = true
        }
    }
})

export const {setPremium} = premiumSlice.actions;

export default premiumSlice.reducer;