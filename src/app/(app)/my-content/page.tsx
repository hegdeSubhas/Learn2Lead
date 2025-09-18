
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, PlusCircle } from 'lucide-react';
import { CreateManualQuizForm } from './_components/create-manual-quiz-form';

export default async function MyContentPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'mentor') {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">This Page is for Mentors</h1>
          <p className="text-muted-foreground mt-2">
            This section is for mentors to create and manage their content.
          </p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-headline font-bold">My Content</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Create, manage, and share your learning materials with students.
            </p>
        </div>

        <div className="max-w-3xl mx-auto">
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                         <PlusCircle className="h-6 w-6" />
                        <CardTitle>Create a New Quiz</CardTitle>
                    </div>
                    <CardDescription>
                        Build your own quiz by writing the questions and options yourself.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateManualQuizForm />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
