import { Suspense } from "react";
import VerifyEmailClient from "./VerifyEmailClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailClient />
    </Suspense>
  );
}
