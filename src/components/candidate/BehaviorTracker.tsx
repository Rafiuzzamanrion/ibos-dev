"use client";

import { useEffect } from "react";
import { useBehaviorTracking } from "@/hooks/useBehaviorTracking";
import { toast } from "sonner";
import { useAppSelector } from "@/store/hooks";

export function BehaviorTracker() {
  const { tabSwitchCount, fullscreenExitCount } = useBehaviorTracking();
  const prevTabCount = useAppSelector((state) => state.submission.tabSwitchCount);
  const prevFsCount = useAppSelector(
    (state) => state.submission.fullscreenExitCount
  );

  useEffect(() => {
    if (tabSwitchCount > 0) {
      toast.warning("Warning: Tab switching detected", {
        description: `You have switched tabs ${tabSwitchCount} time(s). This activity is being recorded.`,
      });
    }
  }, [tabSwitchCount]);

  useEffect(() => {
    if (fullscreenExitCount > 0) {
      toast.warning("Warning: Fullscreen exit detected", {
        description:
          "Please return to fullscreen mode. Attempting to restore fullscreen...",
      });
    }
  }, [fullscreenExitCount]);

  return null;
}
