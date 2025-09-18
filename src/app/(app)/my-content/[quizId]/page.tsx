
import { createClient } from '@/lib/supabase/server';
import { getQuizSubmissions, type QuizSubmission } from '@/services/content';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, User, Calendar, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function SubmissionRow({ submission }: { submission: QuizSubmission }) {
    return (
        <TableRow>
            <TableCell>
                <div className="font-medium flex items-center gap-2">
                    <User size={14} />
                    {submission.student_name}
                </div>
            </TableCell>
            <TableCell className="text-center">
                 <Badge variant={submission.score > 5 ? "default" : "destructive"}>
                     {submission.score}
                </Badge>
            </TableCell>
            <TableCell className="text-right">
                <div className="text-muted-foreground flex justify-end items-center gap-2">
                    <Calendar size={14} />
                    {new Date(submission.submitted_at).toLocaleString()}
                </div>
            </TableCell>
        </TableRow>
    )
}

export default async function QuizSubmissionsPage({ params }: { params: { quizId: string }}) {
    const quizId = Number(params.quizId);
    if (isNaN(quizId)) {
        notFound();
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: submissions, error, quizTitle } = await getQuizSubmissions(quizId, user.id);

    return (
        <div className="space-y-8">
             <Button variant="outline" asChild>
                <Link href="/my-content">← Back to My Content</Link>
            </Button>
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold">Quiz Submissions</h1>
                <p className="text-muted-foreground mt-2">
                   Results for: <span className="font-semibold">{quizTitle || '...'}</span>
                </p>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Student Results</CardTitle>
                    <CardDescription>Review the scores and submission times for your students.</CardDescription>
                </CardHeader>
                <CardContent>
                     {error && (
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {submissions && submissions.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="text-center">Score</TableHead>
                                    <TableHead className="text-right">Submitted At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {submissions.map(submission => (
                                    <SubmissionRow key={submission.id} submission={submission} />
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        !error && (
                             <div className="flex flex-col items-center justify-center text-center py-10">
                                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                                <h2 className="text-xl font-semibold">No Submissions Yet</h2>
                                <p className="text-muted-foreground mt-2">
                                    This quiz has not been completed by any students.
                                </p>
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
