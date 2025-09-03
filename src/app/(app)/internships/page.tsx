
import { InternshipList } from './_components/internship-list';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function InternshipListSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {[...Array(6)].map((_, index) => (
                <Card key={index}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                         <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                         </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default function InternshipsPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold">Real-time Internships</h1>
                <p className="text-muted-foreground mt-2">
                    Live internship opportunities powered by RapidAPI.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Available Internships</CardTitle>
                    <CardDescription>
                        Showing all available internships.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<InternshipListSkeleton />}>
                        <InternshipList />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
