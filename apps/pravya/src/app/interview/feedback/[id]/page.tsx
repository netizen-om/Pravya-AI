"use client";

import type { DetailedInterviewFeedback } from "@/utlis/zod";
import FeedbackPage from "@/components/feedback/Feedback-page";
import { useParams } from "next/navigation";
import { getFeedback } from "@/actions/interview-action";
import { useCallback, useEffect, useState } from "react";

// Mock data for demonstration
const mockFeedback: DetailedInterviewFeedback = {
  overallPerformance: {
    overallScore: 88,
    summary:
      "Excellent technical knowledge and communication skills. Strong problem-solving approach with clear articulation. Minor areas for improvement in handling edge cases and time management.",
    keyStrengths: [
      "Exceptional technical depth and system design thinking",
      "Clear communication with well-structured explanations",
      "Strong problem-solving methodology and analytical approach",
      "Confident delivery with professional demeanor",
    ],
    keyAreasForImprovement: [
      "Consider edge cases and error handling more thoroughly",
      "Improve time management during complex problem-solving",
      "Provide more concrete examples from past experiences",
      "Enhance follow-up questions to clarify requirements",
    ],
  },
  dashboardMetrics: {
    communication: {
      score: 8,
      comment:
        "Clear articulation with good pacing. Excellent use of technical terminology while remaining accessible.",
    },
    technicalCommunication: {
      score: 9,
      comment:
        "Outstanding ability to explain complex concepts. Breaks down technical ideas into digestible parts.",
    },
    hardSkills: {
      score: 8,
      comment:
        "Strong technical foundation with solid understanding of core concepts and best practices.",
    },
    problemSolving: {
      score: 7,
      comment:
        "Good analytical approach but could benefit from considering more edge cases upfront.",
    },
    softSkills: {
      score: 8,
      comment:
        "Demonstrates strong teamwork mindset and collaborative approach to problem-solving.",
    },
    confidence: {
      score: 8,
      comment:
        "Confident delivery with professional presence. Shows comfort with technical discussions.",
    },
  },
  communicationAndDelivery: {
    pace: {
      rating: "Just Right",
      comment:
        "Speaking pace was well-calibrated, allowing for clear comprehension without rushing.",
    },
    fillerWords: {
      frequency: "Low",
      commonFillers: ["um", "like"],
      comment:
        "Minimal use of filler words. Demonstrates good command of language and confidence.",
    },
    toneAndConfidence: {
      score: 8,
      comment:
        "Professional and enthusiastic tone throughout. Conveyed confidence without arrogance.",
    },
    clarityAndArticulation: {
      score: 8,
      comment:
        "Clear enunciation and appropriate volume. Easy to understand throughout the interview.",
    },
  },
  questionBreakdown: [
    {
      questionId: "q1",
      questionText:
        "Tell me about a time you faced a significant technical challenge.",
      userAnswerTranscript:
        "In my previous role, I was tasked with optimizing a database query that was taking over 30 seconds to execute. I started by analyzing the query execution plan, identified missing indexes, and implemented proper caching strategies. The result was reducing query time to under 2 seconds, which significantly improved user experience.",
      specificFeedback: {
        relevance: {
          score: 9,
          comment:
            "Directly addressed the question with a concrete technical challenge.",
        },
        clarity: {
          score: 8,
          comment:
            "Well-structured explanation with clear problem and solution.",
        },
        depthAndExamples: {
          score: 8,
          comment: "Good use of specific metrics and technical details.",
        },
        structure: {
          score: 9,
          comment:
            "Excellent STAR method application with clear context and results.",
        },
      },
      positivePoints:
        "Outstanding use of the STAR method. Provided specific metrics and demonstrated clear problem-solving methodology.",
      suggestedImprovement:
        "Consider mentioning the tools or technologies used (e.g., database type, caching solution) for more technical depth.",
      modelAnswerExample:
        "When faced with a slow database query, I followed a systematic approach: first profiled the query to identify bottlenecks, then implemented targeted optimizations including index creation and query restructuring. I also introduced caching for frequently accessed data. This reduced query time from 30s to 2s, improving page load times by 93%.",
    },
    {
      questionId: "q2",
      questionText: "How do you approach learning new technologies?",
      userAnswerTranscript:
        "I believe in a hands-on approach. When learning something new, I start with official documentation and tutorials, then immediately build a small project to apply the concepts. I also engage with community resources and contribute to open-source projects when possible.",
      specificFeedback: {
        relevance: {
          score: 8,
          comment: "Good answer that addresses the learning approach question.",
        },
        clarity: {
          score: 7,
          comment: "Clear but could provide more specific examples.",
        },
        depthAndExamples: {
          score: 6,
          comment:
            "Would benefit from concrete examples of technologies learned.",
        },
        structure: {
          score: 8,
          comment: "Well-organized response with logical flow.",
        },
      },
      positivePoints:
        "Demonstrates proactive learning mindset and engagement with community. Shows practical approach to skill development.",
      suggestedImprovement:
        "Provide a specific example of a technology you recently learned and how you applied it in a project.",
      modelAnswerExample:
        "I follow a structured learning approach: I start with official documentation to understand core concepts, then build a small project to apply knowledge. For example, when learning React, I built a task management app to practice hooks and state management. I also contribute to open-source projects and participate in code reviews to learn from experienced developers.",
    },
  ],
  roleSpecificFit: {
    technicalCompetency:
      "The candidate demonstrates strong technical competency with solid understanding of system design, database optimization, and modern development practices. They show proficiency in problem-solving and can articulate complex technical concepts clearly. Areas for growth include deeper exploration of distributed systems and advanced architectural patterns.",
    behavioralCompetency:
      "Excellent soft skills with demonstrated ability to communicate effectively, collaborate with teams, and take initiative in learning. Shows strong growth mindset and adaptability. Would benefit from more examples of leadership experiences and conflict resolution scenarios.",
    overallFitMessage:
      "This candidate is a strong fit for the Senior Software Engineer role. They bring solid technical skills, excellent communication abilities, and a collaborative mindset. With continued focus on edge case handling and architectural depth, they would be an excellent addition to the team.",
  },
};

// const data : DetailedInterviewFeedback =

export default function Home() {
  const [feedback, setFeedback] = useState({});
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    async function fetchFeedback() {
      if (!id) return;
      const feedbackData = await getFeedback(id);
      console.log(feedbackData);
      setFeedback(feedbackData);
    }

    fetchFeedback();
  }, [id]);

  return <FeedbackPage feedback={mockFeedback} />;
}
