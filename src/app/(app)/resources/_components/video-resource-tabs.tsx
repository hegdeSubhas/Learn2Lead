
"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const categories = [
    { value: 'general', label: 'General' },
    { value: 'web', label: 'Web Dev' },
    { value: 'data', label: 'Data Science' },
    { value: 'ai', label: 'AI/ML' },
    { value: 'mobile', label: 'Mobile Dev' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'arts', label: 'Arts' },
];

export function VideoResourceTabs({ children, currentCategory }: { children: React.ReactNode, currentCategory: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleValueChange = (category: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('video_category', category);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <Tabs value={currentCategory} onValueChange={handleValueChange} className="w-full">
            <div className="flex justify-center mb-6">
                <TabsList className="grid w-full max-w-4xl grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
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
