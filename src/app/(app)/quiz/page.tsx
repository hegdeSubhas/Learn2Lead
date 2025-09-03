import { QuizClient } from "./_components/quiz-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function QuizPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold">Self-Evaluation Quiz</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Test your knowledge in a variety of fields. Select a category to begin!
                </p>
            </div>
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Take a Quiz</CardTitle>
                    <CardDescription>Select a category and we will generate a quiz for you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <QuizClient />
                </CardContent>
            </Card>
        </div>
    );
}
