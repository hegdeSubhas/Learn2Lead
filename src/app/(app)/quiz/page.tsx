
import { createClient } from '@/lib/supabase/server';
import { getMentorQuizzesForStudent } from '@/services/quiz';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, FileQuestion, BookCopy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function QuizPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <p>You must be logged in to see quizzes.</p>;
    }

    const { data: quizzes, error } = await getMentorQuizzesForStudent(user.id);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold">Your Quizzes</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Here are the quizzes assigned by your mentors. Test your knowledge!
                </p>
            </div>
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Available Quizzes</CardTitle>
                    <CardDescription>Select a quiz to begin.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error Fetching Quizzes</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {quizzes && quizzes.length > 0 ? (
                        <div className="space-y-4">
                            {quizzes.map((quiz) => (
                                <div key={quiz.id} className="border p-4 rounded-lg flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Topic: {quiz.topic} | By: {quiz.mentor_name}
                                        </p>
                                    </div>
                                    <Button asChild>
                                        <Link href={`/quiz/${quiz.id}`}>
                                            Start Quiz
                                            <FileQuestion className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        !error && (
                             <div className="flex flex-col items-center justify-center text-center py-10">
                                <BookCopy className="h-12 w-12 text-muted-foreground mb-4" />
                                <h2 className="text-xl font-semibold">No Quizzes Found</h2>
                                <p className="text-muted-foreground mt-2">
                                    It looks like you haven't connected with any mentors yet, or your mentors haven't created any quizzes.
                                </p>
                             </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
