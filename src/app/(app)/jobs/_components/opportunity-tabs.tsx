"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const categories = [
    { value: 'internships', label: 'Internships' },
    { value: 'jobs', label: 'Jobs' },
];

export function OpportunityTabs({ children, currentCategory }: { children: React.ReactNode, currentCategory: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleValueChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('category', category);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Tabs value={currentCategory} onValueChange={handleValueChange} className="w-full">
            <div className="flex justify-center mb-4">
                <TabsList>
                    {categories.map((cat) => (
                        <TabsTrigger key={cat.value} value={cat.value}>{cat.label}</TabsTrigger>
                    ))}
                </TabsList>
            </div>
             <TabsContent value={currentCategory}>
                {children}
            </TabsContent>
        </Tabs>
    );
}
