"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateTutorialsAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Find Tutorials
    </Button>
  );
}

export function TutorialForm() {
  const initialState = { success: false };
  const [state, formAction] = useActionState(generateTutorialsAction, initialState);
  const tutorialsRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic / Skill</Label>
          <Input id="topic" name="topic" placeholder="e.g., React, Python for Data Science" required />
          <p className="text-xs text-muted-foreground">Enter the topic you want to learn.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="interests">Your Interests (Optional)</Label>
          <Textarea
            id="interests"
            name="interests"
            placeholder="e.g., I'm a beginner and prefer video tutorials."
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
        <div className="space-y-6 pt-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Suggested Tutorials & Resources</CardTitle>
                </CardHeader>
                <CardContent ref={tutorialsRef} className="prose prose-sm dark:prose-invert max-w-none text-card-foreground prose-headings:font-headline prose-headings:text-base prose-ul:my-2 prose-li:my-1 prose-p:my-2">
                    <div dangerouslySetInnerHTML={{ __html: state.result.tutorials }} />
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
