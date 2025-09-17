"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, Terminal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getQuizAction, type QuizQuestion } from '../actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { quizCategories } from '@/services/quiz';

type Answers = { [key: number]: string };

const questionAmounts = [5, 10, 15];

export function QuizClient() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = async () => {
    if (!selectedCategory) return;
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    const result = await getQuizAction({ categoryId: selectedCategory, numQuestions: selectedAmount });
    if (result.success && result.questions) {
      setQuestions(result.questions);
      handleRestart();
    } else {
      setError(result.error || "Failed to fetch quiz questions.");
    }
    setIsLoading(false);
  };

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  }

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
    setError(null);
    setSelectedCategory('');
    setCurrentQuestion(0);
  }

  const score = Object.keys(answers).reduce((acc, key) => {
    const index = parseInt(key, 10);
    if (answers[index] === questions[index].correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const question = useMemo(() => {
    if (questions.length === 0) return null;
    return questions[currentQuestion];
  }, [questions, currentQuestion]);


  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Generating your quiz...</p>
        </div>
    )
  }

  if (error) {
    return (
        <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    )
  }

  // If questions are not loaded yet, show category selector
  if (questions.length === 0) {
    return (
        <div className="space-y-4 text-center">
            <p>Select a category and number of questions to start the quiz!</p>
            <div className="flex flex-col sm:flex-row w-full max-w-md items-center space-y-2 sm:space-y-0 sm:space-x-2 mx-auto">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a category..." />
                    </SelectTrigger>
                    <SelectContent>
                        {quizCategories.map(cat => (
                            <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select value={String(selectedAmount)} onValueChange={(val) => setSelectedAmount(Number(val))}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Number of questions" />
                    </SelectTrigger>
                    <SelectContent>
                        {questionAmounts.map(amount => (
                            <SelectItem key={amount} value={String(amount)}>{amount} Questions</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
             <div className="flex justify-center">
                <Button onClick={handleStartQuiz} disabled={!selectedCategory || isLoading}>
                    Start Quiz
                </Button>
            </div>
        </div>
    )
  }

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Quiz Results for {quizCategories.find(c => c.id === Number(selectedCategory))?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg">
            You scored {score} out of {questions.length}
          </p>
          <div className='space-y-4'>
            {questions.map((q, index) => (
                <div key={index} className="p-4 border rounded-lg">
                    <p className="font-semibold">{q.question}</p>
                    <p className={`flex items-center gap-2 mt-2 ${answers[index] === q.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                        {answers[index] === q.correctAnswer ? <CheckCircle size={16}/> : <XCircle size={16}/>}
                        Your answer: {answers[index] || "Not answered"}
                    </p>
                    {answers[index] !== q.correctAnswer && (
                        <p className="text-green-700 mt-1">Correct answer: {q.correctAnswer}</p>
                    )}
                </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleRestart} className="w-full sm:w-auto">Restart Quiz</Button>
            <Button onClick={resetQuiz} variant="outline" className="w-full sm:w-auto">Choose New Category</Button>
        </CardFooter>
      </Card>
    );
  }

  if (!question) return null;

  // This will only render if there are questions and we are not showing results.
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Question {currentQuestion + 1} of {questions.length}
      </p>
      <h3 className="text-lg font-semibold">{question.question}</h3>
      <RadioGroup
        value={answers[currentQuestion] || ''}
        onValueChange={handleAnswerChange}
      >
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const optionId = `option-${currentQuestion}-${index}`;
            return (
              <div key={optionId} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={optionId} />
                <Label htmlFor={optionId}>{option}</Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
      <Button onClick={handleNext} disabled={!answers[currentQuestion]}>
        {currentQuestion < questions.length - 1 ? 'Next' : 'Finish'}
      </Button>
    </div>
  );
}
