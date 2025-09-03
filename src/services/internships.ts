// This is a placeholder for the actual API call.
// We'll replace this with a real API call to the Rapid Internship API.

export interface Internship {
    id: string;
    title: string;
    company_name: string;
    location: string;
    description: string;
    url: string;
    type: string | null;
    via: string;
}

const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    company_name: 'Innovatech',
    location: 'Remote',
    description: 'Work on exciting projects and gain hands-on experience with our engineering team. You will be contributing to our core products.',
    url: '#',
    type: 'Full-time',
    via: 'Mock API',
  },
  {
    id: '2',
    title: 'Product Management Intern',
    company_name: 'Future Creations',
    location: 'New York, NY',
    description: 'Help define product roadmaps, work with cross-functional teams and conduct market research for our upcoming product launches.',
    url: '#',
    type: 'Part-time',
    via: 'Mock API',
  },
   {
    id: '3',
    title: 'Data Analyst Intern',
    company_name: 'DataDriven Co.',
    location: 'Remote',
    description: 'Analyze large datasets to extract meaningful insights. Work with our data science team to build dashboards and reports.',
    url: '#',
    type: 'Internship',
    via: 'Mock API',
  },
   {
    id: '4',
    title: 'UX/UI Design Intern',
    company_name: 'Creative Minds',
    location: 'San Francisco, CA',
    description: 'Join our design team to create intuitive and beautiful user experiences. You will be working on wireframes, mockups, and prototypes.',
    url: '#',
    type: 'Internship',
    via: 'Mock API',
  },
];


export async function getInternships(): Promise<Internship[]> {
  const apiKey = process.env.RAPID_INTERNSHIP_API_KEY;

  if (!apiKey) {
    console.log("RAPID_INTERNSHIP_API_KEY is not set. Using mock data.");
    return MOCK_INTERNSHIPS;
  }
  
  // Placeholder for fetching from RapidAPI
  // const url = 'https://your-rapidapi-endpoint.p.rapidapi.com/search?query=...';
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     'X-RapidAPI-Key': apiKey,
  //     'X-RapidAPI-Host': 'your-rapidapi-endpoint.p.rapidapi.com'
  //   }
  // };
  //
  // try {
  //   const response = await fetch(url, options);
  //   if (!response.ok) {
  //      throw new Error(`API call failed with status: ${response.status}`)
  //   }
  //   const result = await response.json();
  //   // You might need to transform the result to match the Internship[] type
  //   return result.data; 
  // } catch (error) {
  //   console.error(error);
  //   throw new Error("Failed to fetch real internship data. Please check your API key and endpoint.");
  // }
  
  // For now, return mock data until the user provides API details
  return MOCK_INTERNSHIPS;
}
