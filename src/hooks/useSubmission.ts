"use client";

import { useState, useCallback } from "react";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { markSubmitted } from "@/store/slices/submissionSlice";
import { clearOfflineAnswers } from "@/utils/offlineStorage";

export function useSubmission() {
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useAppDispatch();
  const { tabSwitchCount, fullscreenExitCount } = useAppSelector(
    (state) => state.submission
  );

  const submitAnswers = useCallback(
    async (
      examId: string,
      answers: Record<string, string | string[]>,
      isAutoSubmitted = false
    ) => {
      setSubmitting(true);
      try {
        const formattedAnswers = Object.entries(answers).map(
          ([questionId, answer]) => ({
            questionId,
            answer,
          })
        );

        const response = await api.post("/submissions", {
          examId,
          answers: formattedAnswers,
          tabSwitchCount,
          fullscreenExitCount,
          isAutoSubmitted,
        });

        dispatch(markSubmitted());
        await clearOfflineAnswers();
        return response.data;
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, tabSwitchCount, fullscreenExitCount]
  );

  return { submitting, submitAnswers };
}
