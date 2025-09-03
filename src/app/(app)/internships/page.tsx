"use client"

import { InternshipList } from './_components/internship-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Suspense, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const categories = [
    { value: 'all', label: 'All' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'AI & ML', label: 'AI & ML' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Product Management', label: 'Product Management' },
]

function InternshipListSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
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
    const [category, setCategory] = useState<string>('all');

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-headline font-bold">Real-time Internships</h1>
                <p className="text-muted-foreground mt-2">
                    Live internship opportunities powered by RapidAPI.
                </p>
            </div>

             <Tabs value={category} onValueChange={setCategory} className="w-full">
                <div className="flex justify-center">
                    <TabsList className="grid w-full max-w-4xl grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
                        {categories.map((cat) => (
                            <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                <TabsContent value={category}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Internships</CardTitle>
                            <CardDescription>
                                {category === 'all' ? 'Showing all internships.' : `Showing internships for ${category}.`}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Suspense fallback={<InternshipListSkeleton />}>
                                <InternshipList category={category === 'all' ? undefined : category} />
                            </Suspense>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
