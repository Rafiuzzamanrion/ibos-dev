import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExam } from "@/types/exam.types";

interface CandidateState {
  exams: IExam[];
  loading: boolean;
}

const initialState: CandidateState = {
  exams: [],
  loading: false,
};

const candidateSlice = createSlice({
  name: "candidate",
  initialState,
  reducers: {
    setExams(state, action: PayloadAction<IExam[]>) {
      state.exams = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const { setExams, setLoading } = candidateSlice.actions;

export default candidateSlice.reducer;
