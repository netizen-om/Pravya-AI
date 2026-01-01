"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center">
        <div style={{ textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <p>An unexpected error occurred.</p>

          <button onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
