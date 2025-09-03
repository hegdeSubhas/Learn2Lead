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
    title: 'Future Leaders in Tech Scholarship',
    provider: 'Tech Forward Foundation',
    amount: '₹5,00,000',
    deadline: 'October 31, 2024',
    field: 'Technology',
    image: 'https://picsum.photos/400/200?random=1',
    hint: 'technology code',
    url: '#',
  },
  {
    id: '2',
    title: 'Rural Innovators Grant',
    provider: 'Countryside Development Fund',
    amount: '₹2,50,000',
    deadline: 'November 15, 2024',
    field: 'Community Development',
    image: 'https://picsum.photos/400/200?random=2',
    hint: 'rural landscape',
    url: '#',
  },
  {
    id: '3',
    title: 'Women in STEM Scholarship',
    provider: 'Girls Who Code India',
    amount: '₹10,00,000',
    deadline: 'December 1, 2024',
    field: 'STEM',
    image: 'https://picsum.photos/400/200?random=3',
    hint: 'women science',
    url: '#',
  },
  {
    id: '4',
    title: 'First Generation Scholars Program',
    provider: 'National Education Board',
    amount: 'Full Tuition',
    deadline: 'January 5, 2025',
    field: 'Any',
    image: 'https://picsum.photos/400/200?random=4',
    hint: 'graduation cap',
    url: '#',
  },
  {
    id: '5',
    title: 'Keep India Smiling Foundational Scholarship',
    provider: 'Colgate-Palmolive (India) Ltd.',
    amount: '₹30,000 per year',
    deadline: 'Varies',
    field: 'Any',
    image: 'https://picsum.photos/400/200?random=5',
    hint: 'students smiling',
    url: '#',
  },
  {
    id: '6',
    title: 'HDFC Bank Parivartan\'s ECSS Programme',
    provider: 'HDFC Bank',
    amount: 'Up to ₹75,000',
    deadline: 'September 30, 2024',
    field: 'School/Undergraduate',
    image: 'https://picsum.photos/400/200?random=6',
    hint: 'bank education',
    url: '#',
  },
  {
    id: '7',
    title: 'Reliance Foundation Scholarships',
    provider: 'Reliance Foundation',
    amount: 'Up to ₹2,00,000',
    deadline: 'October 15, 2024',
    field: 'Undergraduate/Postgraduate',
    image: 'https://picsum.photos/400/200?random=7',
    hint: 'modern building',
    url: '#',
  },
  {
    id: '8',
    title: 'Tata Trusts Medical and Healthcare Scholarships',
    provider: 'Tata Trusts',
    amount: 'Varies',
    deadline: 'Varies',
    field: 'Medical',
    image: 'https://picsum.photos/400/200?random=8',
    hint: 'doctor hospital',
    url: '#',
  }
];

export async function getScholarships(): Promise<Scholarship[]> {
    // In the future, this could fetch from a live API.
    // For now, it returns a realistic mock list.
    return MOCK_SCHOLARSHIPS;
}
