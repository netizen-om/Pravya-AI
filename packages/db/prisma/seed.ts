import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// A structured array containing all the data we want to seed.
const seedData = [
  {
    mainCategoryName: 'Technical',
    subCategories: [
      {
        subCategoryName: 'Frontend Development',
        templates: [
          {
            title: 'Junior React Developer Interview',
            description: 'Focuses on core React concepts, hooks, and state management for entry-level roles.',
            estimatedDuration: 45,
            tags: ['React', 'JavaScript', 'Junior', 'Technical'],
          },
          {
            title: 'Senior Angular Engineer Interview',
            description: 'Covers advanced Angular topics, RxJS, state management patterns, and system design.',
            estimatedDuration: 60,
            tags: ['Angular', 'TypeScript', 'Senior', 'Technical'],
          },
          {
            title: 'Vue.js Mid-Level Assessment',
            description: 'Assesses proficiency in Vue 3, the Composition API, and component libraries.',
            estimatedDuration: 50,
            tags: ['Vue.js', 'Mid-Level', 'Technical'],
          },
           {
            title: 'Next.js & Vercel Pro',
            description: 'Interview covering Next.js App Router, Server Actions, and Vercel deployment strategies.',
            estimatedDuration: 55,
            tags: ['Next.js', 'React', 'Vercel', 'Mid-Level', 'Technical'],
          },
        ],
      },
      {
        subCategoryName: 'Backend Development',
        templates: [
          {
            title: 'Node.js & Express API Challenge',
            description: 'A practical challenge to build and explain a RESTful API with authentication.',
            estimatedDuration: 60,
            tags: ['Node.js', 'Express', 'Mid-Level', 'Technical'],
          },
          {
            title: 'Senior Java (Spring Boot) Interview',
            description: 'Deep dive into Spring framework, microservices architecture, and database optimization.',
            estimatedDuration: 75,
            tags: ['Java', 'Spring Boot', 'Senior', 'Technical'],
          },
          {
            title: 'PHP (Laravel) Developer',
            description: 'Covers core Laravel concepts, Eloquent ORM, and Blade templating.',
            estimatedDuration: 50,
            tags: ['PHP', 'Laravel', 'Mid-Level', 'Technical'],
          },
          {
            title: 'Senior .NET Core Engineer',
            description: 'Focuses on C#, ASP.NET Core, Entity Framework, and Azure services.',
            estimatedDuration: 70,
            tags: ['.NET', 'C#', 'Azure', 'Senior', 'Technical'],
          },
        ],
      },
      {
        subCategoryName: 'DevOps',
        templates: [
          {
            title: 'AWS Cloud Engineer Scenario',
            description: 'Scenario-based questions on AWS services, CI/CD pipelines, and infrastructure as code.',
            estimatedDuration: 60,
            tags: ['AWS', 'CI/CD', 'Terraform', 'Mid-Level', 'Technical'],
          },
          {
            title: 'Kubernetes Administrator Interview',
            description: 'Focuses on K8s architecture, pod management, networking, and troubleshooting.',
            estimatedDuration: 50,
            tags: ['Kubernetes', 'Docker', 'Senior', 'Technical'],
          },
        ],
      },
      {
        subCategoryName: 'Mobile Development',
        templates: [
          {
            title: 'iOS Developer (SwiftUI)',
            description: 'Focuses on Swift, SwiftUI, Combine, and Core Data for native iOS app development.',
            estimatedDuration: 60,
            tags: ['iOS', 'Swift', 'SwiftUI', 'Mid-Level', 'Mobile'],
          },
          {
            title: 'Android Developer (Kotlin)',
            description: 'Covers Kotlin, Jetpack Compose, Coroutines, and MVVM architecture.',
            estimatedDuration: 60,
            tags: ['Android', 'Kotlin', 'Compose', 'Mid-Level', 'Mobile'],
          },
          {
            title: 'React Native Developer',
            description: 'Assesses skills in building cross-platform applications with React Native.',
            estimatedDuration: 55,
            tags: ['React Native', 'Mobile', 'JavaScript', 'Mid-Level'],
          },
        ],
      },
      {
        subCategoryName: 'AI & Machine Learning',
        templates: [
          {
            title: 'Machine Learning Engineer',
            description: 'Covers fundamental ML algorithms, model training, evaluation, and deployment with Python.',
            estimatedDuration: 75,
            tags: ['Python', 'Scikit-learn', 'TensorFlow', 'Mid-Level', 'AI/ML'],
          },
          {
            title: 'Natural Language Processing (NLP) Specialist',
            description: 'Deep dive into text processing, transformers, and libraries like Hugging Face.',
            estimatedDuration: 65,
            tags: ['NLP', 'Python', 'PyTorch', 'Senior', 'AI/ML'],
          },
        ],
      },
      {
        subCategoryName: 'Data Science',
        templates: [
          {
            title: 'Data Analyst Interview',
            description: 'Focuses on SQL, data visualization (Tableau/Power BI), and statistical analysis.',
            estimatedDuration: 60,
            tags: ['SQL', 'Tableau', 'Excel', 'Junior', 'Data'],
          },
          {
            title: 'Data Scientist (Python)',
            description: 'Covers data manipulation with Pandas, statistical modeling, and machine learning principles.',
            estimatedDuration: 80,
            tags: ['Python', 'Pandas', 'SQL', 'Statistics', 'Mid-Level', 'Data'],
          },
        ],
      },
    ],
  },
  {
    mainCategoryName: 'Sales',
    subCategories: [
      {
        subCategoryName: 'Sales Development',
        templates: [
          {
            title: 'SDR Outbound Prospecting Roleplay',
            description: 'A roleplay session focused on cold calling, email outreach, and objection handling.',
            estimatedDuration: 30,
            tags: ['Sales', 'SDR', 'Prospecting', 'Junior'],
          },
          {
            title: 'Lead Qualification Practice',
            description: 'Practice qualifying inbound leads using frameworks like BANT or MEDDIC.',
            estimatedDuration: 25,
            tags: ['Sales', 'Lead Qualification', 'B2B', 'Behavioral'],
          },
        ],
      },
      {
        subCategoryName: 'Account Executive',
        templates: [
          {
            title: 'SaaS Product Demonstration',
            description: 'Simulates a live product demo for a potential high-value client.',
            estimatedDuration: 45,
            tags: ['Sales', 'AE', 'SaaS', 'Closing', 'Mid-Level'],
          },
          {
            title: 'Negotiation & Closing Techniques',
            description: 'Roleplay scenarios focused on navigating pricing discussions and closing deals.',
            estimatedDuration: 40,
            tags: ['Sales', 'Negotiation', 'Senior', 'Behavioral'],
          },
        ],
      },
      {
        subCategoryName: 'Customer Success',
        templates: [
           {
            title: 'Customer Success Manager Onboarding',
            description: 'Scenario-based interview on handling client onboarding, renewals, and escalations.',
            estimatedDuration: 40,
            tags: ['Customer Success', 'SaaS', 'Behavioral', 'Mid-Level'],
          },
        ]
      }
    ],
  },
  {
    mainCategoryName: 'Marketing',
    subCategories: [
      {
        subCategoryName: 'Digital Marketing',
        templates: [
          {
            title: 'SEO Specialist Case Study',
            description: 'Analyze a sample website and propose a detailed SEO strategy for growth.',
            estimatedDuration: 50,
            tags: ['Marketing', 'SEO', 'Strategy', 'Mid-Level'],
          },
          {
            title: 'PPC Campaign Manager Simulation',
            description: 'Create and optimize a mock Google Ads campaign based on a given budget and goals.',
            estimatedDuration: 45,
            tags: ['Marketing', 'PPC', 'Google Ads', 'Junior'],
          },
          {
            title: 'Social Media Manager Strategy',
            description: 'Develop a social media content calendar and engagement strategy for a new brand.',
            estimatedDuration: 40,
            tags: ['Marketing', 'Social Media', 'Content', 'Mid-Level'],
          },
        ],
      },
      {
        subCategoryName: 'Content Marketing',
        templates: [
          {
            title: 'Content Strategy Presentation',
            description: 'Develop a 3-month content plan for a B2B SaaS company.',
            estimatedDuration: 40,
            tags: ['Marketing', 'Content', 'Strategy', 'B2B', 'Mid-Level'],
          },
        ],
      },
    ],
  },
  {
    mainCategoryName: 'Finance',
    subCategories: [
      {
        subCategoryName: 'Financial Analyst',
        templates: [
          {
            title: 'Financial Modeling Test',
            description: 'Build a 3-statement financial model from scratch based on historical data.',
            estimatedDuration: 90,
            tags: ['Finance', 'Excel', 'Modeling', 'Mid-Level'],
          },
          {
            title: 'Company Valuation Case Study',
            description: 'Perform a DCF valuation on a public company and present your findings.',
            estimatedDuration: 75,
            tags: ['Finance', 'Valuation', 'Analysis', 'Senior'],
          },
        ],
      },
      {
        subCategoryName: 'Accounting',
        templates: [
          {
            title: 'Corporate Accountant Interview',
            description: 'Covers key accounting principles, journal entries, and financial reporting.',
            estimatedDuration: 60,
            tags: ['Finance', 'Accounting', 'CPA', 'Mid-Level'],
          },
        ],
      },
    ],
  },
  {
    mainCategoryName: 'HR',
    subCategories: [
      {
        subCategoryName: 'Talent Acquisition',
        templates: [
          {
            title: 'Technical Recruiter Screening Practice',
            description: 'A roleplay session to practice screening a software engineering candidate.',
            estimatedDuration: 35,
            tags: ['HR', 'Recruiting', 'Tech', 'Behavioral'],
          },
          {
            title: 'Candidate Sourcing Strategy',
            description: 'Develop a multi-channel sourcing strategy for a hard-to-fill role.',
            estimatedDuration: 40,
            tags: ['HR', 'Sourcing', 'Strategy', 'Mid-Level'],
          },
        ],
      },
      {
        subCategoryName: 'HR Business Partner',
        templates: [
          {
            title: 'Employee Relations Scenario',
            description: 'Handle a complex, hypothetical employee conflict scenario.',
            estimatedDuration: 45,
            tags: ['HR', 'HRBP', 'Behavioral', 'Senior'],
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log('Start seeding...');

  // --- 1. Clean up the database ---
  console.log('Cleaning existing data...');
  // Delete in reverse order of creation due to relations
  await prisma.interviewTemplate.deleteMany();
  await prisma.subCategory.deleteMany();
  await prisma.mainCategory.deleteMany();
  await prisma.tag.deleteMany();

  // --- 2. Seed the data ---
  for (const categoryData of seedData) {
    // Create Main Category
    const mainCategory = await prisma.mainCategory.create({
      data: {
        name: categoryData.mainCategoryName,
      },
    });
    console.log(`Created main category: ${mainCategory.name}`);

    for (const subCategoryData of categoryData.subCategories) {
      // Create Sub Category
      const subCategory = await prisma.subCategory.create({
        data: {
          name: subCategoryData.subCategoryName,
          mainCategoryId: mainCategory.mainCategoryId,
        },
      });
      console.log(`  - Created sub category: ${subCategory.name}`);

      for (const templateData of subCategoryData.templates) {
        // Create Interview Template and connect or create tags
        await prisma.interviewTemplate.create({
          data: {
            title: templateData.title,
            description: templateData.description,
            estimatedDuration: templateData.estimatedDuration,
            subCategoryId: subCategory.subCategoryId,
            tags: {
              connectOrCreate: templateData.tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            },
          },
        });
        console.log(`    - Created template: ${templateData.title}`);
      }
    }
  }

  console.log('Seeding finished. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });