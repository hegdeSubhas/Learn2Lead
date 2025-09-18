
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
];


export async function getInternships(category: string = 'internships'): Promise<Internship[]> {
  
  if (!process.env.GEMINI_API_KEY || !process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
    console.log("Required API keys for AI search are not set. Using mock data.");
    const filteredMock = MOCK_DATA.filter(d => {
        if (category === 'jobs') return d.type?.toLowerCase() === 'full-time';
        if (category === 'internships') return d.type?.toLowerCase() === 'internship' || d.type?.toLowerCase() === 'part-time';
        return true;
    });
    return filteredMock;
  }
  
  let queryTerm = "jobs in India";
  if (category === 'internships') {
    queryTerm = 'internships in India';
  } else if (category === 'jobs') {
    queryTerm = 'developer jobs in India';
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
