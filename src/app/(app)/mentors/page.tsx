
import { createClient } from '@/lib/supabase/server';
import { getMentors } from '@/services/mentors';
import { MentorCard } from './_components/mentor-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Users } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function MentorsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role === 'mentor') {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">This Page is for Students</h1>
          <p className="text-muted-foreground mt-2">
            As a mentor, you can manage student requests from your dashboard.
          </p>
        </div>
    );
  }

  const { data: mentors, error } = await getMentors(user.id);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Find a Mentor</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Connect with experienced professionals who can guide you on your career path.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Mentors</CardTitle>
          <CardDescription>Browse the list of mentors and send a connection request.</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {mentors && mentors.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            !error && <p>No mentors are available at the moment. Please check back later.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
