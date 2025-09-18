
"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { createAiQuizAction } from "../actions";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Quiz with AI
        </Button>
    )
}

const questionAmounts = [5, 10, 15];

export function CreateQuizForm() {
    const { toast } = useToast();
    const initialState = { success: false, message: "" };
    const [state, formAction] = useActionState(createAiQuizAction, initialState);
    
    useEffect(() => {
        if (state.message) {
             toast({
                title: state.success ? "Success" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
        }
    }, [state, toast]);

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Quiz Title</Label>
                <Input id="title" name="title" placeholder="e.g., Introduction to Python" required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea id="description" name="description" placeholder="A short description of what this quiz covers." />
            </div>
             <div className="space-y-2">
                <Label htmlFor="topic">Question Topic</Label>
                <Input id="topic" name="topic" placeholder="e.g., Indian History" required />
                <p className="text-xs text-muted-foreground">The AI will generate questions based on this topic.</p>
            </div>
             <div className="space-y-2">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                 <Select name="numQuestions" defaultValue="5">
                    <SelectTrigger>
                        <SelectValue placeholder="Number of questions" />
                    </SelectTrigger>
                    <SelectContent>
                        {questionAmounts.map(amount => (
                            <SelectItem key={amount} value={String(amount)}>{amount} Questions</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <SubmitButton />
        </form>
    )
}
