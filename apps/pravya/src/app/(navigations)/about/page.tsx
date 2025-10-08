import { BackButton } from "@/components/BackButton";
import { Lightbulb, Target, Users, Heart } from "lucide-react";
import Link from "next/link";

const values = [
  {
    icon: <Target className="h-10 w-10 text-white" />,
    name: "Our Mission",
    description:
      "To democratize interview preparation, making high-quality, AI-driven practice accessible to everyone, everywhere.",
  },
  {
    icon: <Lightbulb className="h-10 w-10 text-white" />,
    name: "Innovation",
    description:
      "We are constantly pushing the boundaries of AI to provide the most realistic and helpful interview feedback possible.",
  },
  {
    icon: <Users className="h-10 w-10 text-white" />,
    name: "User-Centricity",
    description:
      "Our users are at the heart of everything we do. We build features that solve real problems and lead to their success.",
  },
  {
    icon: <Heart className="h-10 w-10 text-white" />,
    name: "Integrity",
    description:
      "We are committed to building a trustworthy platform that respects user data and provides transparent, constructive feedback.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <BackButton />
      </header>

      <section className="text-center py-20 sm:py-28 px-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
          About Pravya AI
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-gray-400">
          We are a team of innovators, engineers, and career enthusiasts
          dedicated to building the future of interview preparation. Our mission
          is to give everyone the confidence to ace their dream interview.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-24 bg-gray-900/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-base font-semibold leading-7 text-gray-400">
              Our Story
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The Platform Born from a Need
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Pravya AI was founded on a simple yet powerful idea: interview
              practice should be effective, accessible, and insightful. We saw
              countless talented individuals struggle with the interview process
              due to a lack of realistic practice and personalized feedback. We
              decided to change that by building an intelligent platform that
              acts as a personal interview coach, available 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-base font-semibold leading-7 text-gray-400">
              Our Core Values
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              The Principles That Guide Us
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
              {values.map((value) => (
                <div
                  key={value.name}
                  className="flex flex-col p-8 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors"
                >
                  <dt className="flex items-center gap-x-3 text-xl font-semibold text-white">
                    {value.icon}
                    {value.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base text-gray-400">
                    <p className="flex-auto">{value.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to Ace Your Next Interview?
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-400">
          Join thousands of users who are building confidence and landing their
          dream jobs with Pravya AI.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/dashboard" 
            className="rounded-md bg-white px-5 py-3 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Start Practicing Now
          </Link>
          <Link
            href="/contact"
            className="text-sm font-semibold leading-6 text-white group"
          >
            Contact us{" "}
            <span
              aria-hidden="true"
              className="group-hover:translate-x-1 transition-transform"
            >
              →
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
