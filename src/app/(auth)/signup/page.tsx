import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm } from "./_components/signup-form";
import Link from "next/link";

export default function SignupPage() {
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
                <CardDescription>Join our community and start your journey today!</CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm />
                 <p className="mt-4 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/login" className="font-medium text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </CardContent>
        </Card>
    )
}
