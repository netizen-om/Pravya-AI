"use server"

// Mock data - replace with actual database calls
const mockCategoriesData = [
  {
    mainCategoryId: "clx_tech",
    name: "Technical",
    templates: [
      {
        id: "tmpl_1",
        title: "Senior React Developer",
        description:
          "Comprehensive interview for senior-level React developers covering advanced patterns and architecture.",
        tags: ["React", "Senior", "Frontend"],
      },
      {
        id: "tmpl_2",
        title: "Junior Node.js API",
        description: "Entry-level interview focusing on Node.js fundamentals and REST API development.",
        tags: ["Node.js", "Junior", "Backend"],
      },
      {
        id: "tmpl_3",
        title: "Full Stack TypeScript",
        description: "Mid-level interview covering both frontend and backend with TypeScript.",
        tags: ["TypeScript", "Mid-Level", "Full Stack"],
      },
      {
        id: "tmpl_4",
        title: "DevOps Engineer",
        description: "Interview for DevOps professionals covering CI/CD, containerization, and infrastructure.",
        tags: ["DevOps", "Senior", "Infrastructure"],
      },
    ],
  },
  {
    mainCategoryId: "clx_sales",
    name: "Sales",
    templates: [
      {
        id: "tmpl_5",
        title: "Cold Calling Practice",
        description: "Master the art of cold calling with realistic scenarios and objection handling.",
        tags: ["Communication", "Mid-Level", "Sales"],
      },
      {
        id: "tmpl_6",
        title: "Enterprise Sales",
        description: "Advanced sales interview for enterprise account executives.",
        tags: ["Enterprise", "Senior", "Sales"],
      },
    ],
  },
  {
    mainCategoryId: "clx_marketing",
    name: "Marketing",
    templates: [
      {
        id: "tmpl_7",
        title: "Product Marketing Manager",
        description: "Interview for product marketing managers covering strategy and execution.",
        tags: ["Product", "Mid-Level", "Marketing"],
      },
      {
        id: "tmpl_8",
        title: "Growth Marketing Specialist",
        description: "Focus on growth strategies, analytics, and experimentation.",
        tags: ["Growth", "Mid-Level", "Marketing"],
      },
    ],
  },
]

const mockCategoryDetails: Record<string, any> = {
  clx_tech: {
    mainCategoryName: "Technical",
    subCategories: [
      {
        name: "Frontend",
        templates: [
          {
            id: "tmpl_1",
            title: "Senior React Developer",
            description:
              "Comprehensive interview for senior-level React developers covering advanced patterns and architecture.",
            tags: ["React", "Senior"],
          },
          {
            id: "tmpl_10",
            title: "Senior React Developer",
            description:
              "Comprehensive interview for senior-level React developers covering advanced patterns and architecture.",
            tags: ["React", "Senior"],
          },
          {
            id: "tmpl_9",
            title: "Vue.js Fundamentals",
            description: "Interview covering Vue.js core concepts and best practices.",
            tags: ["Vue.js", "Junior"],
          },
          {
            id: "tmpl_10",
            title: "Angular Advanced",
            description: "Deep dive into Angular framework for experienced developers.",
            tags: ["Angular", "Senior"],
          },
        ],
      },
      {
        name: "Backend",
        templates: [
          {
            id: "tmpl_2",
            title: "Junior Node.js API",
            description: "Entry-level interview focusing on Node.js fundamentals and REST API development.",
            tags: ["Node.js", "Junior"],
          },
          {
            id: "tmpl_11",
            title: "Python Django Expert",
            description: "Advanced Django interview for experienced Python developers.",
            tags: ["Python", "Senior"],
          },
        ],
      },
      {
        name: "DevOps",
        templates: [
          {
            id: "tmpl_4",
            title: "DevOps Engineer",
            description: "Interview for DevOps professionals covering CI/CD, containerization, and infrastructure.",
            tags: ["DevOps", "Senior"],
          },
          {
            id: "tmpl_12",
            title: "Kubernetes Specialist",
            description: "Deep dive into Kubernetes orchestration and container management.",
            tags: ["Kubernetes", "Senior"],
          },
        ],
      },
    ],
  },
  clx_sales: {
    mainCategoryName: "Sales",
    subCategories: [
      {
        name: "Inside Sales",
        templates: [
          {
            id: "tmpl_5",
            title: "Cold Calling Practice",
            description: "Master the art of cold calling with realistic scenarios and objection handling.",
            tags: ["Communication", "Mid-Level"],
          },
          {
            id: "tmpl_13",
            title: "Phone Sales Techniques",
            description: "Advanced phone sales strategies and closing techniques.",
            tags: ["Phone", "Mid-Level"],
          },
        ],
      },
      {
        name: "Enterprise Sales",
        templates: [
          {
            id: "tmpl_6",
            title: "Enterprise Sales",
            description: "Advanced sales interview for enterprise account executives.",
            tags: ["Enterprise", "Senior"],
          },
          {
            id: "tmpl_14",
            title: "Complex Deal Negotiation",
            description: "Handling complex multi-stakeholder negotiations.",
            tags: ["Negotiation", "Senior"],
          },
        ],
      },
    ],
  },
  clx_marketing: {
    mainCategoryName: "Marketing",
    subCategories: [
      {
        name: "Product Marketing",
        templates: [
          {
            id: "tmpl_7",
            title: "Product Marketing Manager",
            description: "Interview for product marketing managers covering strategy and execution.",
            tags: ["Product", "Mid-Level"],
          },
          {
            id: "tmpl_15",
            title: "Go-to-Market Strategy",
            description: "Developing and executing go-to-market strategies.",
            tags: ["Strategy", "Senior"],
          },
        ],
      },
      {
        name: "Growth Marketing",
        templates: [
          {
            id: "tmpl_8",
            title: "Growth Marketing Specialist",
            description: "Focus on growth strategies, analytics, and experimentation.",
            tags: ["Growth", "Mid-Level"],
          },
          {
            id: "tmpl_16",
            title: "Data-Driven Marketing",
            description: "Analytics and data-driven decision making in marketing.",
            tags: ["Analytics", "Mid-Level"],
          },
        ],
      },
    ],
  },
}

export async function getMainCategoriesWithTemplates() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCategoriesData
}

export async function getCategoryDetails(categorySlug: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCategoryDetails[categorySlug] || mockCategoryDetails["clx_tech"]
}
