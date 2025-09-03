
"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const categories = [
    { value: 'all', label: 'All' },
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Data Science', label: 'Data Science' },
    { value: 'AI & ML', label: 'AI & ML' },
    { value: 'Mobile Development', label: 'Mobile Development' },
    { value: 'Cybersecurity', label: 'Cybersecurity' },
    { value: 'Product Management', label: 'Product Management' },
];

export function InternshipTabs({ children, currentCategory }: { children: React.ReactNode, currentCategory: string }) {
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
            <div className="flex justify-center">
                <TabsList className="grid w-full max-w-4xl grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
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
