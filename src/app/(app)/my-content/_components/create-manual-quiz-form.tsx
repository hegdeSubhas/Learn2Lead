
"use client";

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createManualQuizAction } from '../actions';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const questionSchema = z.object({
    question: z.string().min(1, "Question cannot be empty."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "Must have 4 options."),
    correctAnswer: z.string().min(1, "A correct answer must be selected."),
});

const manualQuizSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    topic: z.string().min(3, "Topic must be at least 3 characters."),
    description: z.string().optional(),
    questions: z.array(questionSchema).min(1, "At least one question is required."),
});

type ManualQuizFormValues = z.infer<typeof manualQuizSchema>;

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    const { pending } = useFormStatus();
    const disabled = pending || isSubmitting;
    return (
        <Button type="submit" disabled={disabled} className="w-full">
            {disabled && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Quiz
        </Button>
    )
}

export function CreateManualQuizForm() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<ManualQuizFormValues>({
        resolver: zodResolver(manualQuizSchema),
        defaultValues: {
            title: '',
            topic: '',
            description: '',
            questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'questions',
    });

    const onSubmit = async (data: ManualQuizFormValues) => {
        setIsSubmitting(true);
        setServerError(null);

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('topic', data.topic);
        formData.append('description', data.description || '');
        data.questions.forEach((q, qIndex) => {
            formData.append(`questions[${qIndex}].question`, q.question);
            formData.append(`questions[${qIndex}].correctAnswer`, q.correctAnswer);
            q.options.forEach((opt, oIndex) => {
                formData.append(`questions[${qIndex}].options[${oIndex}]`, opt);
            });
        });
        
        const result = await createManualQuizAction({ success: false, message: ''}, formData);

        toast({
            title: result.success ? "Success" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });

        if(result.success) {
            form.reset();
        } else {
            setServerError(result.message);
        }

        setIsSubmitting(false);
    };
    
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             {serverError && (
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{serverError}</AlertDescription>
                </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Quiz Title</Label>
                    <Input id="title" {...form.register('title')} placeholder="e.g., Fundamentals of Algebra" />
                    {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="topic">Topic / Subject</Label>
                    <Input id="topic" {...form.register('topic')} placeholder="e.g., Mathematics" />
                    {form.formState.errors.topic && <p className="text-sm text-destructive">{form.formState.errors.topic.message}</p>}
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" {...form.register('description')} placeholder="A short description of what this quiz covers." />
            </div>

            <div className="space-y-4">
                <Label className="text-lg font-semibold">Questions</Label>
                {fields.map((field, index) => (
                    <div key={field.id} className="space-y-3 border p-4 rounded-lg relative">
                        <div className="flex justify-between items-center">
                            <Label htmlFor={`questions.${index}.question`} className="font-medium">Question {index + 1}</Label>
                             <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                        <Textarea
                            id={`questions.${index}.question`}
                            {...form.register(`questions.${index}.question`)}
                            placeholder="Enter the question text"
                        />
                         {form.formState.errors.questions?.[index]?.question && <p className="text-sm text-destructive">{form.formState.errors.questions?.[index]?.question?.message}</p>}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                             <RadioGroup 
                                onValueChange={(value) => form.setValue(`questions.${index}.correctAnswer`, value)}
                                value={form.watch(`questions.${index}.correctAnswer`)}
                             >
                                {Array.from({ length: 4 }).map((_, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                        <RadioGroupItem value={form.watch(`questions.${index}.options.${optionIndex}`)} id={`q${index}-opt${optionIndex}`} />
                                        <Label htmlFor={`q${index}-opt${optionIndex}`} className="sr-only">Set option {optionIndex+1} as correct</Label>
                                        <Input
                                            {...form.register(`questions.${index}.options.${optionIndex}`)}
                                            placeholder={`Option ${optionIndex + 1}`}
                                            className={cn(form.watch(`questions.${index}.correctAnswer`) === form.watch(`questions.${index}.options.${optionIndex}`) && form.watch(`questions.${index}.correctAnswer`) !== '' && "border-green-500")}
                                        />
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                         {form.formState.errors.questions?.[index]?.options && <p className="text-sm text-destructive">All 4 options are required.</p>}
                         {form.formState.errors.questions?.[index]?.correctAnswer && <p className="text-sm text-destructive">{form.formState.errors.questions?.[index]?.correctAnswer?.message}</p>}
                    </div>
                ))}
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={() => append({ question: '', options: ['', '', '', ''], correctAnswer: '' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Question
            </Button>
            
            <SubmitButton isSubmitting={isSubmitting} />
        </form>
    );
}
