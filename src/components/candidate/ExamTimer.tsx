"use client";

interface ExamTimerProps {
  formattedTime: string;
}

export function ExamTimer({ formattedTime }: ExamTimerProps) {
  // Simple check for < 60s based on "MM:SS" format where MM is "00"
  const isWarning =
    formattedTime.length === 5 && formattedTime.startsWith("00:");

  return (
    <div
      className={`flex items-center justify-center rounded-lg px-6 py-3 transition-colors duration-300 ${
        isWarning ? "bg-red-50" : "bg-gray-100"
      }`}
    >
      <span
        className={`text-base font-semibold ${
          isWarning ? "text-red-500 animate-pulse" : "text-gray-700"
        }`}
      >
        {formattedTime} left
      </span>
    </div>
  );
}
