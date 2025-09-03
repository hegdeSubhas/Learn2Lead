"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';

const quizQuestions = [
  {
    question: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Hyperlink and Text Markup Language',
      'Home Tool Markup Language',
    ],
    correctAnswer: 'Hyper Text Markup Language',
  },
  {
    question: 'Which CSS property is used to change the text color of an element?',
    options: ['text-color', 'font-color', 'color', 'foreground-color'],
    correctAnswer: 'color',
  },
  {
    question: 'What is the correct way to write a JavaScript array?',
    options: [
      'var colors = (1:"red", 2:"green", 3:"blue")',
      'var colors = ["red", "green", "blue"]',
      'var colors = "red", "green", "blue"',
      'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")',
    ],
    correctAnswer: 'var colors = ["red", "green", "blue"]',
  },
];

type Answers = { [key: number]: string };

export function QuizClient() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
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

  const score = Object.keys(answers).reduce((acc, key) => {
    const index = parseInt(key, 10);
    if (answers[index] === quizQuestions[index].correctAnswer) {
      return acc + 1;
    }
    return acc;
  }, 0);

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-lg">
            You scored {score} out of {quizQuestions.length}
          </p>
          <div className='space-y-4'>
            {quizQuestions.map((q, index) => (
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
        <CardFooter>
            <Button onClick={handleRestart} className="w-full">Restart Quiz</Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Question {currentQuestion + 1} of {quizQuestions.length}
      </p>
      <h3 className="text-lg font-semibold">{question.question}</h3>
      <RadioGroup
        value={answers[currentQuestion] || ''}
        onValueChange={handleAnswerChange}
      >
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
      <Button onClick={handleNext} disabled={!answers[currentQuestion]}>
        {currentQuestion < quizQuestions.length - 1 ? 'Next' : 'Finish'}
      </Button>
    </div>
  );
}
