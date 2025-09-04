
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
  {
    id: '5',
    title: 'Cybersecurity Intern',
    company_name: 'SecureNet India',
    location: 'Hyderabad, India',
    description: 'Learn about network security, threat analysis, and incident response in a real-world environment. Assist in monitoring and protecting our systems.',
    url: 'https://www.google.com/search?q=Cybersecurity+Intern',
    type: 'Internship',
  },
  {
    id: '6',
    title: 'AI/ML Intern',
    company_name: 'AI Innovators',
    location: 'Remote',
    description: 'Work on cutting-edge AI projects, including natural language processing and computer vision. Develop and train machine learning models.',
    url: 'https://www.google.com/search?q=AI%2FML+Intern',
    type: 'Internship',
  },
  {
    id: '7',
    title: 'Junior Web Developer',
    company_name: 'Web Weavers',
    location: 'Remote',
    description: 'We are looking for a junior web developer to join our team. You will be working on building and maintaining our client websites.',
    url: 'https://www.google.com/search?q=Junior+Web+Developer+Job',
    type: 'Full-time',
  },
  {
    id: '8',
    title: 'DevOps Engineer',
    company_name: 'CloudCorp',
    location: 'Bengaluru, India',
    description: 'Seeking a DevOps engineer to help us automate our infrastructure and deployment pipelines. Experience with AWS and Kubernetes is a plus.',
    url: 'https://www.google.com/search?q=DevOps+Engineer+Job',
    type: 'Full-time',
  },
  {
    id: '9',
    title: 'Marketing Intern',
    company_name: 'Brand Boosters',
    location: 'Remote',
    description: 'Assist the marketing team in creating and executing campaigns. Learn about social media marketing, SEO, and content creation.',
    url: 'https://www.google.com/search?q=Marketing+Intern',
    type: 'Internship',
  },
  {
    id: '10',
    title: 'Financial Analyst',
    company_name: 'Capital Growth Partners',
    location: 'Mumbai, India',
    description: 'Analyze financial data, prepare reports, and assist with financial modeling and forecasting for our clients.',
    url: 'https://www.google.com/search?q=Financial+Analyst+Job',
    type: 'Full-time',
  },
  {
    id: '11',
    title: 'Content Writer Intern',
    company_name: 'Wordsmith Agency',
    location: 'Remote',
    description: 'Write engaging content for blogs, websites, and social media. Excellent writing and research skills required.',
    url: 'https://www.google.com/search?q=Content+Writer+Intern',
    type: 'Internship',
  },
  {
    id: '12',
    title: 'Sales Executive',
    company_name: 'Growth Catalysts',
    location: 'Delhi, India',
    description: 'Join our sales team to identify new business opportunities, build client relationships, and drive revenue growth.',
    url: 'https://www.google.com/search?q=Sales+Executive+Job',
    type: 'Full-time',
  },
  {
    id: '13',
    title: 'HR Intern',
    company_name: 'People First Corp',
    location: 'Pune, India',
    description: 'Support the HR team with recruitment, onboarding, and employee engagement activities. A great opportunity to learn about HR processes.',
    url: 'https://www.google.com/search?q=HR+Intern',
    type: 'Internship',
  },
];


export async function getInternships(category: string = 'internships'): Promise<Internship[]> {
  const apiKey = process.env.RAPID_INTERNSHIP_API_KEY;
  const apiHost = process.env.RAPID_INTERNSHIP_API_HOST;

  if (!apiKey || !apiHost) {
    console.log("RAPID_INTERNSHIP_API_KEY or RAPID_INTERNSHIP_API_HOST is not set. Using mock data.");
    const filteredMock = MOCK_DATA.filter(d => {
        if (category === 'jobs') return d.type?.toLowerCase() === 'full-time';
        if (category === 'internships') return d.type?.toLowerCase() === 'internship' || d.type?.toLowerCase() === 'part-time';
        return true;
    });
    return filteredMock;
  }
  
  const query = `${category} in India`;
  const url = `https://${apiHost}/?query=${encodeURIComponent(query)}&num_pages=1`;
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
        return MOCK_DATA;
    }

    const internships: Internship[] = result.data.map((job: any) => {
      const applyUrl = job.job_apply_link && (job.job_apply_link.startsWith('http')) 
        ? job.job_apply_link 
        : `https://www.google.com/search?q=${encodeURIComponent(job.job_title + " " + job.employer_name)}`;

      return {
        id: job.job_id,
        title: job.job_title,
        company_name: job.employer_name || 'N/A',
        location: job.job_city && job.job_state ? `${job.job_city}, ${job.job_state}, ${job.job_country}` : (job.job_country ? `${job.job_country}`: 'Remote'),
        description: job.job_description,
        url: applyUrl,
        type: job.job_employment_type,
      }
    }).filter((job: Internship) => job.title && job.company_name && (job.location.includes('India') || job.location.includes('Remote')));

    return internships;
  } catch (error) {
    console.error("Caught error in getInternships:", error);
    throw new Error("Failed to fetch internship data. Please check your API key and network connection.");
  }
}
