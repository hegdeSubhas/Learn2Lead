
import { findOpportunities } from "@/ai/flows/find-opportunities";

export interface Internship {
    id: string;
    title: string;
    company_name: string;
    location: string;
    description: string;
    url: string;
    type: string | null;
}

const MOCK_DATA: Internship[] = [
  // Internships
  {
    id: '1',
    title: 'Software Engineer Intern',
    company_name: 'Tech Solutions India',
    location: 'Bengaluru, India',
    description: 'Work on exciting projects and gain hands-on experience with our engineering team. You will be contributing to our core products.',
    url: 'https://www.google.com/search?q=Software+Engineer+Intern',
    type: 'Internship',
  },
  {
    id: '2',
    title: 'Product Management Intern',
    company_name: 'Future Innovations',
    location: 'Bengaluru, India',
    description: 'Help define product roadmaps, work with cross-functional teams and conduct market research for our upcoming product launches.',
    url: 'https://www.google.com/search?q=Product+Management+Intern',
    type: 'Internship',
  },
  {
    id: '3',
    title: 'Data Analyst Intern',
    company_name: 'Data Insights Pvt. Ltd.',
    location: 'Pune, India',
    description: 'Analyze large datasets to extract meaningful insights. Work with our data science team to build dashboards and reports.',
    url: 'https://www.google.com/search?q=Data+Analyst+Intern',
    type: 'Internship',
  },
  {
    id: '4',
    title: 'UX/UI Design Intern',
    company_name: 'Creative Designs',
    location: 'Mumbai, India',
    description: 'Join our design team to create intuitive and beautiful user experiences. You will be working on wireframes, mockups, and prototypes.',
    url: 'https://www.google.com/search?q=UX%2FUI+Design+Intern',
    type: 'Internship',
  },
  {
    id: '5',
    title: 'Marketing Intern',
    company_name: 'Growth Catalysts',
    location: 'Delhi, India',
    description: 'Support the marketing team in daily administrative tasks and assist in marketing and advertising promotional activities.',
    url: 'https://www.google.com/search?q=Marketing+Intern',
    type: 'Internship',
  },
  {
    id: '6',
    title: 'Cybersecurity Intern',
    company_name: 'SecureNet',
    location: 'Hyderabad, India',
    description: 'Learn about security best practices, monitor for security threats, and assist in vulnerability assessments.',
    url: 'https://www.google.com/search?q=Cybersecurity+Intern',
    type: 'Internship',
  },
  // Full-time Jobs
  {
    id: '7',
    title: 'Frontend Developer',
    company_name: 'Innovatech',
    location: 'Chennai, India',
    description: 'We are looking for a skilled Frontend Developer to join our team to build and maintain high-quality web applications.',
    url: 'https://www.google.com/search?q=Frontend+Developer+Job',
    type: 'Full-time',
  },
  {
    id: '8',
    title: 'Backend Engineer (Node.js)',
    company_name: 'LogicSphere',
    location: 'Bengaluru, India',
    description: 'Responsible for managing the interchange of data between the server and the users. Your primary focus will be the development of all server-side logic.',
    url: 'https://www.google.com/search?q=Backend+Engineer+Job',
    type: 'Full-time',
  },
  {
    id: '9',
    title: 'DevOps Engineer',
    company_name: 'CloudFirst Solutions',
    location: 'Remote',
    description: 'Work with our team to manage and improve our CI/CD pipeline, and ensure the reliability and scalability of our infrastructure.',
    url: 'https://www.google.com/search?q=DevOps+Engineer+Job',
    type: 'Full-time',
  },
  {
    id: '10',
    title: 'Mobile App Developer (React Native)',
    company_name: 'AppWorks',
    location: 'Noida, India',
    description: 'Develop and maintain cross-platform mobile applications for both iOS and Android using React Native.',
    url: 'https://www.google.com/search?q=Mobile+App+Developer+Job',
    type: 'Full-time',
  },
  {
    id: '11',
    title: 'AI/ML Engineer',
    company_name: 'IntelliGen',
    location: 'Hyderabad, India',
    description: 'Design and implement machine learning models, and work on cutting-edge AI-powered features for our products.',
    url: 'https://www.google.com/search?q=AI%2FML+Engineer+Job',
    type: 'Full-time',
  },
  {
    id: '12',
    title: 'Full Stack Developer',
    company_name: 'BuildIt All',
    location: 'Pune, India',
    description: 'Join our dynamic team as a Full Stack Developer to work on both frontend and backend of our flagship product.',
    url: 'https://www.google.com/search?q=Full+Stack+Developer+Job',
    type: 'Full-time',
  },
];


export async function getInternships(category: string = 'internships'): Promise<Internship[]> {
  
  if (!process.env.GEMINI_API_KEY || !process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
    console.log("Required API keys for AI search are not set. Using mock data.");
    if (category === 'jobs') {
        return MOCK_DATA.filter(d => d.type === 'Full-time');
    }
    // Default to internships
    return MOCK_DATA.filter(d => d.type === 'Internship');
  }
  
  let queryTerm = "jobs in India";
  if (category === 'internships') {
    queryTerm = '"Intern" in India';
  } else if (category === 'jobs') {
    queryTerm = '"Developer" in India';
  }
  
  try {
    const result = await findOpportunities({ query: queryTerm });

    const opportunities: Internship[] = result.opportunities.map((opp, index) => ({
      id: `${opp.title}-${index}`,
      title: opp.title,
      company_name: opp.companyName,
      location: opp.location,
      description: `An opportunity for a ${opp.title} at ${opp.companyName} located in ${opp.location}.`, // AI doesn't provide a description, so we generate one.
      url: opp.url,
      type: category === 'internships' ? 'Internship' : 'Full-time',
    }));

    return opportunities;
  } catch (error) {
    console.error("Caught error in getInternships (AI search):", error);
    throw new Error("Failed to fetch opportunities using AI. Please check your API keys and network connection.");
  }
}
