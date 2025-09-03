import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const scholarships = [
  {
    title: 'Future Leaders in Tech Scholarship',
    provider: 'Tech Forward Foundation',
    amount: '$5,000',
    deadline: 'October 31, 2024',
    field: 'Technology',
    image: 'https://picsum.photos/400/200?random=1',
    hint: 'technology code'
  },
  {
    title: 'Rural Innovators Grant',
    provider: 'Countryside Development Fund',
    amount: '$2,500',
    deadline: 'November 15, 2024',
    field: 'Community Development',
    image: 'https://picsum.photos/400/200?random=2',
    hint: 'rural landscape'
  },
  {
    title: 'Women in STEM Scholarship',
    provider: 'Girls Who Code',
    amount: '$10,000',
    deadline: 'December 1, 2024',
    field: 'STEM',
    image: 'https://picsum.photos/400/200?random=3',
    hint: 'women science'
  },
  {
    title: 'First Generation Scholars Program',
    provider: 'National Education Board',
    amount: 'Full Tuition',
    deadline: 'January 5, 2025',
    field: 'Any',
    image: 'https://picsum.photos/400/200?random=4',
    hint: 'graduation cap'
  },
];

export default function ScholarshipsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Scholarships</h1>
        <p className="text-muted-foreground mt-2">
          Find financial support for your educational journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((scholarship, index) => (
          <Card key={index} className="flex flex-col overflow-hidden">
            <div className="relative h-40 w-full">
              <Image
                src={scholarship.image}
                alt={scholarship.title}
                fill
                className="object-cover"
                data-ai-hint={scholarship.hint}
              />
            </div>
            <CardHeader>
              <CardTitle>{scholarship.title}</CardTitle>
              <CardDescription>{scholarship.provider}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-primary">{scholarship.amount}</span>
                <Badge variant="secondary">{scholarship.field}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Deadline: {scholarship.deadline}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Learn More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
