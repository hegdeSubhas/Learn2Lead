
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createAnnouncementAction } from "../actions";
import { useEffect, useRef } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Announcement
        </Button>
    )
}

export function CreateAnnouncementForm() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const initialState = { success: false, message: "" };
    const [state, formAction] = useActionState(createAnnouncementAction, initialState);

    useEffect(() => {
        if (state.message) {
            toast({
                title: state.success ? "Success" : "Error",
                description: state.message,
                variant: state.success ? "default" : "destructive",
            });
            if (state.success) {
                formRef.current?.reset();
            }
        }
    }, [state, toast]);

    return (
        <form ref={formRef} action={formAction} className="space-y-4">
            <Textarea
                name="content"
                placeholder="Write your announcement here..."
                required
                rows={4}
            />
            <SubmitButton />
        </form>
    );
}
