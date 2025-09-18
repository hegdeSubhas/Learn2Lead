
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnnouncementsForDashboard, getQuizzesForDashboard } from "@/services/dashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BookCopy, FileQuestion, Megaphone, Terminal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function AnnouncementsList({ userId }: { userId: string }) {
    const { data: announcements, error } = await getAnnouncementsForDashboard(userId);

    if (error) return <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
    
    return (
         <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    <CardTitle className="text-xl font-headline">Announcements from Your Mentors</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {announcements && announcements.length > 0 ? (
                    <div className="space-y-4">
                        {announcements.map((item) => (
                            <div key={item.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                                <p className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{item.mentor_name}</span>
                                    {' '}&bull;{' '}
                                    {new Date(item.created_at).toLocaleDateString()}
                                </p>
                                <p className="mt-1">{item.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-6">
                        <Megaphone className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">No recent announcements.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

async function QuizzesList({ userId }: { userId: string }) {
    const { data: quizzes, error } = await getQuizzesForDashboard(userId);

    if (error) return <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;

    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <BookCopy className="h-5 w-5" />
                    <CardTitle className="text-xl font-headline">Quizzes from Your Mentors</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {quizzes && quizzes.length > 0 ? (
                     <div className="space-y-4">
                        {quizzes.map((quiz) => (
                            <div key={quiz.id} className="border p-4 rounded-lg flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold">{quiz.title}</h3>
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
                    <div className="flex flex-col items-center justify-center text-center py-6">
                        <BookCopy className="h-10 w-10 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground">You have no assigned quizzes.</p>
                    </div>
                )}
                 <div className="mt-4 flex justify-end">
                    <Button variant="link" asChild>
                        <Link href="/quiz">View all quizzes →</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function ContentSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    )
}

export function StudentDashboardContent({ userId }: { userId: string }) {
    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Suspense fallback={<ContentSkeleton />}>
                <AnnouncementsList userId={userId} />
            </Suspense>
            <Suspense fallback={<ContentSkeleton />}>
                <QuizzesList userId={userId} />
            </Suspense>
        </div>
    )
}
