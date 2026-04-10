"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  incrementTabSwitch,
  incrementFullscreenExit,
} from "@/store/slices/submissionSlice";

export function useBehaviorTracking() {
  const dispatch = useAppDispatch();
  const { tabSwitchCount, fullscreenExitCount } = useAppSelector(
    (state) => state.submission
  );

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        dispatch(incrementTabSwitch());
      }
    }

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        dispatch(incrementFullscreenExit());
        setTimeout(() => {
          document.documentElement.requestFullscreen().catch(() => {});
        }, 1000);
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, [dispatch]);

  return { tabSwitchCount, fullscreenExitCount };
}
