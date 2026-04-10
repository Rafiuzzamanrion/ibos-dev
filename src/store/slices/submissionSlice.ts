import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubmissionState {
  answers: Record<string, string | string[]>;
  tabSwitchCount: number;
  fullscreenExitCount: number;
  isSubmitted: boolean;
}

const initialState: SubmissionState = {
  answers: {},
  tabSwitchCount: 0,
  fullscreenExitCount: 0,
  isSubmitted: false,
};

const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {
    setAnswer(
      state,
      action: PayloadAction<{ questionId: string; answer: string | string[] }>
    ) {
      state.answers[action.payload.questionId] = action.payload.answer;
    },
    incrementTabSwitch(state) {
      state.tabSwitchCount += 1;
    },
    incrementFullscreenExit(state) {
      state.fullscreenExitCount += 1;
    },
    markSubmitted(state) {
      state.isSubmitted = true;
    },
    resetSubmission() {
      return initialState;
    },
    restoreAnswers(
      state,
      action: PayloadAction<Record<string, string | string[]>>
    ) {
      state.answers = action.payload;
    },
  },
});

export const {
  setAnswer,
  incrementTabSwitch,
  incrementFullscreenExit,
  markSubmitted,
  resetSubmission,
  restoreAnswers,
} = submissionSlice.actions;

export default submissionSlice.reducer;
