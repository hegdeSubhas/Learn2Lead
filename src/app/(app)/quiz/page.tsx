
import { createClient } from '@/lib/supabase/server';
import { getMentorQuizzesForStudent } from '@/services/quiz';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, FileQuestion, BookCopy } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';

export default async function QuizPage() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <p>You must be logged in to see quizzes.</p>;
    }

    const { data: quizzes, error } = await getMentorQuizzesForStudent(user.id);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold">Quiz Center</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Test your knowledge with quizzes from your mentors.
                </p>
            </div>
            
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BookCopy className="h-6 w-6" />
                        <CardTitle>Quizzes From Your Mentors</CardTitle>
                    </div>
                    <CardDescription>Select a quiz assigned by a mentor to begin.</CardDescription>
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
                                <div key={quiz.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div>
                                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Topic: {quiz.topic} | By: {quiz.mentor_name}
                                        </p>
                                    </div>
                                    <Button asChild size="sm">
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
                                <p className="text-muted-foreground mt-2 text-sm">
                                    It looks like your mentors haven't assigned any quizzes yet.
                                </p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
