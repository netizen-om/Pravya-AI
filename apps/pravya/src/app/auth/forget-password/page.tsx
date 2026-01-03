import { Suspense } from "react";
import ForgetPasswordClient from "./forgetPasswordClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForgetPasswordClient />
    </Suspense>
  );
}
