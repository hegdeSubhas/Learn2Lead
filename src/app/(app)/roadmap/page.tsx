import { RoadmapForm } from './_components/roadmap-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RoadmapPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">
          Career Roadmap Generator
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Enter a job role and your interests to generate a personalized career
          roadmap, complete with suggested learning resources.
        </p>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create Your Roadmap</CardTitle>
          <CardDescription>Fill out the details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <RoadmapForm />
        </CardContent>
      </Card>
    </div>
  );
}
