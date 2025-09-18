
import { createClient } from '@/lib/supabase/server';
import { getQuizForStudent } from '@/services/quiz';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QuizPlayer } from './_components/quiz-player';

export default async function TakeQuizPage({ params }: { params: { quizId: string }}) {
    const quizId = Number(params.quizId);
    if (isNaN(quizId)) {
        notFound();
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: quiz, error } = await getQuizForStudent(quizId, user.id);
    
    if (error || !quiz) {
        // This could be because the user doesn't have access or the quiz doesn't exist
        return (
             <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-destructive">{error || "Could not load quiz. You may not have access or it may not exist."}</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
         <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold">{quiz.title}</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    {quiz.description || `A quiz on the topic of ${quiz.topic}.`}
                </p>
            </div>
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Question 1 of {quiz.questions.length}</CardTitle>
                </CardHeader>
                <CardContent>
                    <QuizPlayer quiz={quiz} />
                </CardContent>
            </Card>
        </div>
    )
}
