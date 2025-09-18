
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { submitQuizAction, type QuizWithQuestions } from '../actions';
import { useRouter } from 'next/navigation';

type Answers = { [key: number]: string };

export function QuizPlayer({ quiz }: { quiz: QuizWithQuestions }) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answers>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<{ score: number; total: number; review: any[] } | null>(null);

    const question = quiz.questions[currentQuestionIndex];

    const handleAnswerChange = (value: string) => {
        setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: value }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    
    const handleSubmit = async () => {
        setIsSubmitting(true);
        const result = await submitQuizAction({
            quizId: quiz.id,
            answers
        });

        if (result.success && result.data) {
            setResults(result.data);
        } else {
            // Handle error, maybe show a toast
            alert(result.error || "An error occurred.");
        }
        setIsSubmitting(false);
    }
    
    if (results) {
        return (
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-2xl">Quiz Results: {quiz.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-center text-lg font-bold">
                        You scored {results.score} out of {results.total}
                    </p>
                    <div className='space-y-4 max-h-96 overflow-y-auto pr-2'>
                        {results.review.map((item, index) => (
                            <div key={index} className="p-4 border rounded-lg">
                                <p className="font-semibold">{item.question}</p>
                                <p className={`flex items-center gap-2 mt-2 ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.isCorrect ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                                    Your answer: {item.yourAnswer || "Not answered"}
                                </p>
                                {!item.isCorrect && (
                                    <p className="text-green-700 mt-1">Correct answer: {item.correctAnswer}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push('/quiz')} className="w-full">
                        Back to Quizzes
                    </Button>
                </CardFooter>
            </Card>
        );
    }


    return (
        <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </p>
            <h3 className="text-lg font-semibold">{question.question}</h3>
            <RadioGroup
                value={answers[currentQuestionIndex] || ''}
                onValueChange={handleAnswerChange}
            >
                <div className="space-y-2">
                {question.options.map((option, index) => {
                    const optionId = `option-${currentQuestionIndex}-${index}`;
                    return (
                    <div key={optionId} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={optionId} />
                        <Label htmlFor={optionId}>{option}</Label>
                    </div>
                    );
                })}
                </div>
            </RadioGroup>
            
            <div className="flex justify-end">
                 {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <Button onClick={handleNext} disabled={!answers[currentQuestionIndex]}>
                        Next
                    </Button>
                ) : (
                    <Button onClick={handleSubmit} disabled={!answers[currentQuestionIndex] || isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Finish & Submit
                    </Button>
                )}
            </div>
        </div>
    );
}
