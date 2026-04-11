"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { AppHeader } from "@/components/shared/AppHeader";
import { AppFooter } from "@/components/shared/AppFooter";
import { EmptyState } from "@/components/shared/EmptyState";
import { CandidateExamCard } from "@/components/candidate/ExamCard";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setExams,
  setLoading,
} from "@/store/slices/candidateSlice";
import api from "@/lib/axios";
import { Search } from "lucide-react";
import { useState } from "react";

export default function CandidateDashboardPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { exams, loading } = useAppSelector((state) => state.candidate);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchPublishedExams = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const response = await api.get("/exams");
      dispatch(setExams(response.data.data));
    } catch {
      dispatch(setExams([]));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPublishedExams();
  }, [fetchPublishedExams]);

  const handleStartExam = useCallback(
    (examId: string) => {
      router.push(`/candidate/exam/${examId}`);
    },
    [router]
  );

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard requiredRole="candidate">
      <div className="flex min-h-screen flex-col">
        <AppHeader title="Dashboard" />

        <main className="flex-1 bg-[#f8f8fc] px-4 py-8 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-foreground">Online Tests</h2>

              <div className="relative">
                <Input
                  placeholder="Search by exam title"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border-primary/30 pr-10 md:w-72"
                  id="search-candidate-exams"
                />
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-xl" />
                ))}
              </div>
            ) : filteredExams.length === 0 ? (
              <EmptyState
                title="No Online Test Available"
                description="Currently, there are no online tests available. Please check back later for updates."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredExams.map((exam) => (
                    <CandidateExamCard
                      key={exam._id}
                      exam={exam}
                      onStart={handleStartExam}
                    />
                  ))}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2">
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-medium">
                      1
                    </button>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      Online Test Per Page
                    </span>
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium w-16">
                      8 <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>

        <AppFooter />
      </div>
    </AuthGuard>
  );
}
