import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "./_components/login-form";
import Link from "next/link";

export default function LoginPage() {
    return (
        <Card>
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl">Welcome Back!</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/signup" className="font-medium text-primary hover:underline">
                        Sign Up
                    </Link>
                </p>
            </CardContent>
        </Card>
    )
}
