"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function SignupForm() {
    // In a real app, you'd use useFormState and an action here.
    const pending = false;

    return (
        <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" name="age" type="number" />
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input id="education" name="education" placeholder="e.g., 12th Grade, B.Tech in CS" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <Input id="skills" name="skills" placeholder="e.g., Python, Communication, Public Speaking" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="hobbies">Hobbies</Label>
                <Input id="hobbies" name="hobbies" placeholder="e.g., Reading, Cricket, Coding" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="ambition">Goal or Ambition</Label>
                <Textarea id="ambition" name="ambition" placeholder="Describe your career goals or what you aspire to become." />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" disabled={pending} className="w-full">
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
            </Button>
        </form>
    )
}
