"use client"

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Terminal, CheckCircle } from "lucide-react";
import { updateUserAction } from "../actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { User } from "@supabase/supabase-js";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
        </Button>
    )
}

export function ProfileForm({ user, profile }: { user: User, profile: any }) {
    const initialState = { success: false, message: "" };
    const [state, formAction] = useActionState(updateUserAction, initialState);

    return (
        <form action={formAction} className="space-y-4">
             {state?.message && (
                <Alert variant={state.success ? "default" : "destructive"} className={state.success ? "border-green-500/50 text-green-700 [&>svg]:text-green-700" : ""}>
                    {state.success ? <CheckCircle className="h-4 w-4" /> : <Terminal className="h-4 w-4" />}
                    <AlertTitle>{state.success ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ''} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" defaultValue={user.email} disabled />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ''} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" type="number" defaultValue={profile?.age ?? ''} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" name="role" defaultValue={profile?.role ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1) : ''} disabled />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="education">Education / Profession</Label>
                <Input id="education" name="education" placeholder="e.g., 12th Grade or Software Engineer @ Google" defaultValue={profile?.education ?? ''} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="skills">Skills / Expertise</Label>
                <Input id="skills" name="skills" placeholder="e.g., Python, Communication, Public Speaking" defaultValue={profile?.skills ?? ''} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="hobbies">Hobbies</Label>
                <Input id="hobbies" name="hobbies" placeholder="e.g., Reading, Cricket, Coding" defaultValue={profile?.hobbies ?? ''} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="ambition">Goal or Ambition / Bio</Label>
                <Textarea id="ambition" name="ambition" placeholder="Describe your career goals or a short bio." defaultValue={profile?.ambition ?? ''}/>
            </div>
            <SubmitButton />
        </form>
    )
}
