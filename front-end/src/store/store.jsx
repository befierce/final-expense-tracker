import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./AuthSlice";
import premiumReducer from "./PremiumSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    premium: premiumReducer,
    
  },
});

export default store;
