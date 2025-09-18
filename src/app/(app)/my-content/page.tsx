
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, PlusCircle, Megaphone } from 'lucide-react';
import { CreateManualQuizForm } from './_components/create-manual-quiz-form';
import { MentorQuizList } from './_components/mentor-quiz-list';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateAnnouncementForm } from './_components/create-announcement-form';
import { MentorAnnouncementList } from './_components/mentor-announcement-list';
import { cookies } from 'next/headers';

function ListSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="border p-4 rounded-lg flex justify-between items-center">
                    <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                </div>
            ))}
        </div>
    )
}


export default async function MyContentPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'mentor') {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">This Page is for Mentors</h1>
          <p className="text-muted-foreground mt-2">
            This section is for mentors to create and manage their content.
          </p>
        </div>
    );
  }

  return (
    <div className="space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-headline font-bold">My Content</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Create, manage, and share your learning materials with students.
            </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <PlusCircle className="h-6 w-6" />
                            <CardTitle>Create a New Quiz</CardTitle>
                        </div>
                        <CardDescription>
                            Build a quiz by writing the questions and options yourself.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreateManualQuizForm />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Megaphone className="h-6 w-6" />
                            <CardTitle>Create an Announcement</CardTitle>
                        </div>
                        <CardDescription>
                           Post an update for all of your connected students.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CreateAnnouncementForm />
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Created Quizzes</CardTitle>
                        <CardDescription>
                            View and manage the quizzes you have created.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense fallback={<ListSkeleton />}>
                            <MentorQuizList mentorId={user.id} />
                        </Suspense>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Your Past Announcements</CardTitle>
                        <CardDescription>
                            A history of announcements you have posted.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Suspense fallback={<ListSkeleton />}>
                            <MentorAnnouncementList mentorId={user.id} />
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
