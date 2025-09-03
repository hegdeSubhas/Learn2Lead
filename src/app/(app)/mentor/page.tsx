import { MentorForm } from './_components/mentor-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MentorPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">
          AI Mentor
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Describe your profile, skills, and aspirations to receive personalized guidance from your AI career mentor.
        </p>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Get Career Guidance</CardTitle>
          <CardDescription>The more detail you provide, the better the advice will be.</CardDescription>
        </CardHeader>
        <CardContent>
          <MentorForm />
        </CardContent>
      </Card>
    </div>
  );
}
