
export interface Scholarship {
    id: string;
    title: string;
    provider: string;
    amount: string;
    deadline: string;
    field: string;
    image: string;
    hint: string;
    url: string;
}

const MOCK_SCHOLARSHIPS: Scholarship[] = [
  {
    id: '1',
    title: 'Keep India Smiling Foundational Scholarship',
    provider: 'Colgate-Palmolive (India) Ltd.',
    amount: 'Up to Rs 75,000 per year',
    deadline: 'Varies (Check Link)',
    field: 'Any Stream',
    image: 'https://picsum.photos/400/200?random=5',
    hint: 'students smiling',
    url: 'https://www.buddy4study.com/page/keep-india-smiling-foundational-scholarship-program',
  },
  {
    id: '2',
    title: 'HDFC Bank Parivartan\'s ECSS Programme',
    provider: 'HDFC Bank',
    amount: 'Up to Rs 75,000',
    deadline: 'September 30, 2025',
    field: 'School/Undergraduate',
    image: 'https://picsum.photos/400/200?random=6',
    hint: 'bank education',
    url: 'https://www.buddy4study.com/page/hdfc-bank-parivartans-ecss-programme',
  },
  {
    id: '3',
    title: 'Reliance Foundation Undergraduate Scholarships',
    provider: 'Reliance Foundation',
    amount: 'Up to Rs 2,00,000',
    deadline: 'October 15, 2025',
    field: 'Undergraduate',
    image: 'https://picsum.photos/400/200?random=7',
    hint: 'modern building',
    url: 'https://www.scholarships.reliancefoundation.org/undergraduate-scholarships.html',
  },
  {
    id: '4',
    title: 'Kotak Kanya Scholarship',
    provider: 'Kotak Mahindra Group',
    amount: 'Up to Rs 1,50,000 per year',
    deadline: 'September 30, 2025',
    field: 'Professional Courses',
    image: 'https://picsum.photos/400/200?random=3',
    hint: 'women empowerment',
    url: 'https://www.kotakeducation.org/kotak-kanya-scholarship/',
  },
  {
    id: '5',
    title: 'PM YASASVI Central Sector Scheme',
    provider: 'Ministry of Social Justice & Empowerment',
    amount: 'Up to Rs 15,000 per year',
    deadline: 'Varies (Check Portal)',
    field: 'Class 9 & 11',
    image: 'https://picsum.photos/400/200?random=4',
    hint: 'government building',
    url: 'https://scholarships.gov.in/',
  },
  {
    id: '6',
    title: 'Post-Matric Scholarship for Students with Disabilities',
    provider: 'Dept. of Empowerment of Persons with Disabilities',
    amount: 'Varies',
    deadline: 'Varies (Check Portal)',
    field: 'Post-Matriculation',
    image: 'https://picsum.photos/400/200?random=2',
    hint: 'inclusive education',
    url: 'https://scholarships.gov.in/',
  },
  {
    id: '7',
    title: 'Tata Trusts Medical and Healthcare Scholarships',
    provider: 'Tata Trusts',
    amount: 'Varies',
    deadline: 'Varies (Check Link)',
    field: 'Medical',
    image: 'https://picsum.photos/400/200?random=8',
    hint: 'doctor hospital',
    url: 'https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants',
  },
  {
    id: '8',
    title: 'Amazon Future Engineer Scholarship',
    provider: 'Amazon India',
    amount: 'Rs 40,000 per year',
    deadline: 'Varies (Check Link)',
    field: 'Computer Science',
    image: 'https://picsum.photos/400/200?random=1',
    hint: 'technology code',
    url: 'https://www.amazonfutureengineer.in/scholarship',
  }
];

export async function getScholarships(): Promise<Scholarship[]> {
    // In the future, this could fetch from a live API.
    // For now, it returns a realistic mock list.
    return MOCK_SCHOLARSHIPS;
}
