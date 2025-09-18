
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Library, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getStudentRequests } from "@/services/requests";
import { Skeleton } from "@/components/ui/skeleton";
import { cookies } from "next/headers";

async function RequestsPreview() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: requests } = await getStudentRequests(user.id);
    const pendingCount = requests?.filter(r => r.status === 'pending').length || 0;

    return (
        <Card>
            <CardHeader>
                 <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    <CardTitle className="text-xl font-headline">Student Requests</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                {pendingCount > 0 ? (
                    <p>You have {pendingCount} new student request{pendingCount > 1 ? 's' : ''} waiting for your review.</p>
                ) : (
                    <p className="text-muted-foreground">You have no new student requests.</p>
                )}
                 <Button asChild className="mt-4">
                    <Link href="/requests">Manage Requests</Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function RequestsPreviewSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
    )
}

export function MentorDashboardContent() {
    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <Suspense fallback={<RequestsPreviewSkeleton />}>
                <RequestsPreview />
            </Suspense>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Library className="h-5 w-5" />
                        <CardTitle className="text-xl font-headline">Manage Your Content</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Create quizzes and post announcements for your students.</p>
                    <Button asChild className="mt-4">
                        <Link href="/my-content">
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Create Content
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
