
import { getMentorQuizzes } from "@/services/content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, FileText, CheckSquare, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export async function MentorQuizList({ mentorId }: { mentorId: string }) {
    const { data: quizzes, error } = await getMentorQuizzes(mentorId);

    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!quizzes || quizzes.length === 0) {
        return <p className="text-sm text-muted-foreground text-center py-4">You haven't created any quizzes yet. Use the form to get started!</p>;
    }

    return (
        <div className="space-y-4">
            {quizzes.map((quiz) => (
                <div key={quiz.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-grow">
                        <h3 className="font-semibold text-lg">{quiz.title}</h3>
                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                            <span className="flex items-center gap-1.5"><FileText size={14}/> Topic: {quiz.topic || 'N/A'}</span>
                            <span className="flex items-center gap-1.5"><CheckSquare size={14}/> {quiz.question_count} Questions</span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14}/> 
                                Created: {new Date(quiz.created_at).toLocaleDateString()}
                            </span>
                        </div>
                         <p className="text-sm text-muted-foreground mt-2">
                           Submissions: {quiz.submission_count}
                        </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/my-content/${quiz.id}`}>
                           View Submissions
                        </Link>
                    </Button>
                </div>
            ))}
        </div>
    );
}
