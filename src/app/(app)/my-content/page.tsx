
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Library, Terminal, User, PlusCircle } from 'lucide-react';
import { getMentorQuizzes, type MentorQuiz } from '@/services/content';
import { CreateManualQuizForm } from './_components/create-manual-quiz-form';

async function QuizList({ quizzes }: { quizzes: MentorQuiz[] }) {
    if (quizzes.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-8">You haven't created any quizzes yet.</p>
    }
    return (
        <div className="space-y-4">
            {quizzes.map(quiz => (
                <div key={quiz.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-semibold">{quiz.title}</h3>
                            {quiz.topic && <p className="text-sm text-primary font-medium">{quiz.topic}</p>}
                        </div>
                         <p className="text-xs text-muted-foreground">{new Date(quiz.created_at).toLocaleDateString()}</p>
                    </div>
                    {quiz.description && <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>}
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-muted-foreground">{quiz.question_count} questions</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

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

  const { data: quizzes, error } = await getMentorQuizzes(user.id);

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-headline font-bold">My Content</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Create, manage, and share your learning materials with students.
            </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
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


            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Library className="h-6 w-6" />
                        <CardTitle>Your Created Quizzes</CardTitle>
                    </div>
                    <CardDescription>
                        A list of all the quizzes you have created.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {quizzes && <QuizList quizzes={quizzes} />}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
