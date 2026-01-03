import { Suspense } from "react";
import SigninClient from "./signinClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SigninClient />
    </Suspense>
  );
}
