"use client";

import type { DetailedInterviewFeedback } from "@/utlis/zod";
import FeedbackPage from "@/components/feedback/Feedback-page";
import { useParams } from "next/navigation";
import { getFeedback } from "@/actions/interview-action";
import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";

export default function Home() {
  const [feedback, setFeedback] = useState<DetailedInterviewFeedback | null>(null);

  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    async function fetchFeedback() {
      if (!id) return;

      const feedbackData = await getFeedback(id);

      if (feedbackData?.fullFeedbackJson) {
        setFeedback(feedbackData.fullFeedbackJson);
      }
    }

    fetchFeedback();
  }, [id]);

  if (!feedback) {
    return (
      <Loader title=""/>
    );
  }

  return <FeedbackPage feedback={feedback} />;
}
