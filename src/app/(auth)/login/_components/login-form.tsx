"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
    // In a real app, you'd use useFormState and an action here.
    const pending = false; 

    return (
        <form className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required defaultValue="test@example.com" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" disabled={pending} className="w-full" asChild>
              <Link href="/dashboard">
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Link>
            </Button>
        </form>
    )
}
