
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
  const apiHost = process.env.RAPID_INTERNSHIP_API_HOST || 'jsearch.p.rapidapi.com';

  if (!apiKey) {
    console.log("RAPID_INTERNSHIP_API_KEY is not set. Using mock data.");
    return MOCK_INTERNSHIPS;
  }
  
  const url = `https://${apiHost}/search?query=internship%20in%20USA&num_pages=1`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost
    }
  };
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
       const errorText = await response.text();
       console.error("API Error Response:", errorText);
       throw new Error(`API call failed with status: ${response.status}`)
    }
    const result = await response.json();

    if (!result.data || !Array.isArray(result.data)) {
        console.warn("API response did not contain expected 'data' array. Using mock data.");
        return MOCK_INTERNSHIPS;
    }

    const internships: Internship[] = result.data.map((job: any) => ({
      id: job.job_id,
      title: job.job_title,
      company_name: job.employer_name || 'N/A',
      location: job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}` : (job.job_country ? `${job.job_country}`: 'Remote'),
      description: job.job_description,
      url: job.job_apply_link,
      type: job.job_employment_type,
      via: job.job_publisher
    })).filter(job => job.title && job.company_name);

    return internships;
  } catch (error) {
    console.error("Caught error in getInternships:", error);
    throw new Error("Failed to fetch internship data. Please check your API key and network connection.");
  }
}
