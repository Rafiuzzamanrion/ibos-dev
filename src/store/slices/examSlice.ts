import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IExam } from "@/types/exam.types";

interface ExamState {
  exams: IExam[];
  currentExam: IExam | null;
  loading: boolean;
  error: string | null;
}

const initialState: ExamState = {
  exams: [],
  currentExam: null,
  loading: false,
  error: null,
};

const examSlice = createSlice({
  name: "exam",
  initialState,
  reducers: {
    setExams(state, action: PayloadAction<IExam[]>) {
      state.exams = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCurrentExam(state, action: PayloadAction<IExam | null>) {
      state.currentExam = action.payload;
    },
    addExam(state, action: PayloadAction<IExam>) {
      state.exams.push(action.payload);
    },
    updateExam(state, action: PayloadAction<IExam>) {
      const index = state.exams.findIndex((e) => e._id === action.payload._id);
      if (index !== -1) {
        state.exams[index] = action.payload;
      }
    },
    removeExam(state, action: PayloadAction<string>) {
      state.exams = state.exams.filter((e) => e._id !== action.payload);
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setExams,
  setCurrentExam,
  addExam,
  updateExam,
  removeExam,
  setLoading,
  setError,
} = examSlice.actions;

export default examSlice.reducer;
