import { Suspense } from "react";
import { AuthCallbackContent } from "./AuthCallbackContent";

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
          <p className="text-text-secondary text-sm">Concluindo login…</p>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
