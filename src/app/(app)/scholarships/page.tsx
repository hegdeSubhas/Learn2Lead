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
import { getScholarships, Scholarship } from '@/services/scholarships';

function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
    return (
        <Card className="flex flex-col overflow-hidden">
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
                <Button variant="outline" className="w-full" asChild>
                   <a href={scholarship.url} target="_blank" rel="noopener noreferrer">Learn More</a>
                </Button>
            </CardFooter>
        </Card>
    )
}


export default async function ScholarshipsPage() {
  const scholarships = await getScholarships();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Scholarships</h1>
        <p className="text-muted-foreground mt-2">
          Find financial support for your educational journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scholarships.map((scholarship) => (
          <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>
    </div>
  );
}
