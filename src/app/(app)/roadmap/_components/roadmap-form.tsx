"use client";

import { useActionState, useFormStatus } from "react";
import { generateRoadmapAction } from "../actions";
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
      Generate Roadmap
    </Button>
  );
}

export function RoadmapForm() {
  const initialState = { success: false };
  const [state, formAction] = useActionState(generateRoadmapAction, initialState);

  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobRole">Job Role</Label>
          <Input id="jobRole" name="jobRole" placeholder="e.g., Software Engineer" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interests">Your Interests</Label>
          <Textarea
            id="interests"
            name="interests"
            placeholder="e.g., Web development, mobile apps, artificial intelligence"
            required
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
                    <CardTitle className="font-headline">Your Personalized Roadmap</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-card-foreground whitespace-pre-wrap">
                    {state.result.roadmap}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Suggested Resources</CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none text-card-foreground whitespace-pre-wrap">
                    {state.result.resources}
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
