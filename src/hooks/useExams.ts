"use client";

import { useCallback } from "react";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setExams,
  addExam,
  removeExam,
  setLoading,
  setError,
} from "@/store/slices/examSlice";
import { IExam } from "@/types/exam.types";

export function useExams() {
  const dispatch = useAppDispatch();
  const { exams, loading, error } = useAppSelector((state) => state.exam);

  const fetchExams = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await api.get<{ data: IExam[] }>("/exams");
      dispatch(setExams(response.data.data));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch exams";
      dispatch(setError(message));
    }
  }, [dispatch]);

  const createExam = useCallback(
    async (data: Partial<IExam>) => {
      const response = await api.post<{ data: IExam }>("/exams", data);
      dispatch(addExam(response.data.data));
      return response.data.data;
    },
    [dispatch]
  );

  const deleteExam = useCallback(
    async (id: string) => {
      await api.delete(`/exams/${id}`);
      dispatch(removeExam(id));
    },
    [dispatch]
  );

  return { exams, loading, error, fetchExams, createExam, deleteExam };
}
