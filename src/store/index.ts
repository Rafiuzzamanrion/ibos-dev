import { configureStore } from "@reduxjs/toolkit";
import examReducer from "./slices/examSlice";
import candidateReducer from "./slices/candidateSlice";
import submissionReducer from "./slices/submissionSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      exam: examReducer,
      candidate: candidateReducer,
      submission: submissionReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
