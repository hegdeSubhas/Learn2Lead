import { TutorialForm } from './_components/tutorial-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TutorialsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">
          Tutorial Finder
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Enter a topic or skill you want to learn, and our AI will suggest a list of relevant learning resources.
        </p>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Find Learning Tutorials</CardTitle>
          <CardDescription>Fill out the details below to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <TutorialForm />
        </CardContent>
      </Card>
    </div>
  );
}
