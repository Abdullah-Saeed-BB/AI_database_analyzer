"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Request error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Something went wrong!</h2>
      <p className="text-[var(--color-text-secondary)]">{error.message || "An unexpected request error occurred."}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-[var(--color-bg-active)] text-[var(--color-white)] rounded-md hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  );
}
