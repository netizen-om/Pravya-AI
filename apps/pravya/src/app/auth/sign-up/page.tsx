import { Suspense } from "react";
import Signup from "./signupClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Signup />
    </Suspense>
  );
}
