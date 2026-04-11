"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { AppHeader } from "@/components/shared/AppHeader";
import { AppFooter } from "@/components/shared/AppFooter";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmployerExamCard } from "@/components/employer/ExamCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useExams } from "@/hooks/useExams";
import { Search } from "lucide-react";
import api from "@/lib/axios";
import { ISubmission } from "@/types/submission.types";

export default function EmployerDashboardPage() {
  const router = useRouter();
  const { exams, loading, fetchExams } = useExams();
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetExamId, setSheetExamId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  const handleViewCandidates = useCallback(async (examId: string) => {
    setSheetExamId(examId);
    setSheetOpen(true);
    setLoadingSubmissions(true);
    try {
      const response = await api.get(`/submissions?examId=${examId}`);
      setSubmissions(response.data.data);
    } catch {
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  const filteredExams = exams.filter((exam) =>
    exam.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AuthGuard requiredRole="employer">
      <div className="flex min-h-screen flex-col">
        <AppHeader title="Dashboard" />

        <main className="flex-1 bg-[#f8f8fc] px-4 py-8 md:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-foreground">Online Tests</h2>

              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <div className="relative">
                  <Input
                    placeholder="Search by exam title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border-primary/30 pr-10 md:w-72"
                    id="search-exams"
                  />
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                </div>

                <Button
                  onClick={() => router.push("/employer/create-test")}
                  className="bg-primary text-white hover:bg-primary/90"
                  id="create-test-button"
                >
                  Create Online Test
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-xl" />
                ))}
              </div>
            ) : filteredExams.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {filteredExams.map((exam) => (
                    <EmployerExamCard
                      key={exam._id}
                      exam={exam}
                      onViewCandidates={handleViewCandidates}
                    />
                  ))}
                </div>

                {/* Pagination */}
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

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>Candidate Submissions</SheetTitle>
            </SheetHeader>

            <div className="mt-6 space-y-4">
              {loadingSubmissions ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))
              ) : submissions.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No submissions yet
                </p>
              ) : (
                <div className="rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium">Name</th>
                        <th className="px-4 py-3 text-left font-medium">Score</th>
                        <th className="px-4 py-3 text-left font-medium">Tab Switches</th>
                        <th className="px-4 py-3 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => {
                        const candidate = sub.candidateId as unknown as {
                          name: string;
                          email: string;
                        };
                        return (
                          <tr key={sub._id} className="border-b">
                            <td className="px-4 py-3">
                              <p className="font-medium">{candidate?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {candidate?.email}
                              </p>
                            </td>
                            <td className="px-4 py-3 font-semibold">
                              {sub.score}
                            </td>
                            <td className="px-4 py-3">{sub.tabSwitchCount}</td>
                            <td className="px-4 py-3">
                              {sub.isAutoSubmitted ? (
                                <span className="text-xs text-orange-600">
                                  Auto-submitted
                                </span>
                              ) : (
                                <span className="text-xs text-green-600">
                                  Submitted
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <AppFooter />
      </div>
    </AuthGuard>
  );
}
