import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { JobTrendsChart } from './_components/job-trends-chart';
import { Button } from '@/components/ui/button';

const jobListings = [
  {
    title: 'Junior Web Developer',
    company: 'Tech Solutions Inc.',
    location: 'Remote',
    type: 'Full-time',
    tags: ['HTML', 'CSS', 'JavaScript', 'React'],
  },
  {
    title: 'Data Science Intern',
    company: 'Data Insights Co.',
    location: 'Hybrid',
    type: 'Internship',
    tags: ['Python', 'SQL', 'Pandas'],
  },
  {
    title: 'Mobile App Developer Intern',
    company: 'AppMakers',
    location: 'On-site',
    type: 'Internship',
    tags: ['Flutter', 'Dart', 'Firebase'],
  },
  {
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    location: 'Remote',
    type: 'Full-time',
    tags: ['Security', 'Networking', 'Linux'],
  },
];

export default function JobsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Jobs</h1>
        <p className="text-muted-foreground mt-2">
          Explore current opportunities and market trends.
        </p>
      </div>

      <JobTrendsChart />

      <div>
        <h2 className="text-2xl font-headline font-semibold mb-4">
          Recent Listings
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {jobListings.map((job, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <CardTitle>{job.title}</CardTitle>
                <CardDescription>
                  {job.company} - {job.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{job.type}</Badge>
                  {job.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Apply Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
