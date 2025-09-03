"use client";

import { useFormState, useFormStatus } from "react-dom";
import { getGuidanceAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, Sparkles } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Get Guidance
    </Button>
  );
}

export function MentorForm() {
  const initialState = { success: false };
  const [state, formAction] = useFormState(getGuidanceAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentProfile">Your Profile</Label>
          <Textarea
            id="studentProfile"
            name="studentProfile"
            placeholder="Describe your interests, skills, academic background, and career aspirations..."
            required
            rows={6}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="specificQuestion">Specific Question (Optional)</Label>
          <Textarea
            id="specificQuestion"
            name="specificQuestion"
            placeholder="e.g., What are the best programming languages to learn for data science?"
            rows={2}
          />
        </div>
        <SubmitButton />
      </form>

      {state?.error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {typeof state.error === 'string' ? state.error : 'Please check your inputs and try again.'}
          </AlertDescription>
        </Alert>
      )}

      {state?.success && state.result && (
        <Card className="mt-6 bg-primary/5">
          <CardHeader className="flex flex-row items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline text-primary">Your Personalized Guidance</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none text-foreground whitespace-pre-wrap">
            {state.result.guidance}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
