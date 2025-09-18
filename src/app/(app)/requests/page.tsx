
import { createClient } from '@/lib/supabase/server';
import { getStudentRequests } from '@/services/requests';
import { RequestCard } from './_components/request-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, BellOff, User } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function RequestsPage() {
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
    
  if (profile?.role === 'student') {
    return (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold">This Page is for Mentors</h1>
          <p className="text-muted-foreground mt-2">
            Students can find and connect with mentors on the "Find a Mentor" page.
          </p>
        </div>
    );
  }

  const { data: requests, error } = await getStudentRequests(user.id);

  const pendingRequests = requests?.filter(r => r.status === 'pending') || [];
  const otherRequests = requests?.filter(r => r.status !== 'pending') || [];


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Student Requests</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Manage incoming mentorship requests from students.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!error && (
        <>
            {/* Pending Requests */}
            <Card>
                <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>New requests from students seeking mentorship.</CardDescription>
                </CardHeader>
                <CardContent>
                {pendingRequests.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {pendingRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                    ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-10">
                        <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No pending requests at the moment.</p>
                    </div>
                )}
                </CardContent>
            </Card>

            {/* Responded Requests */}
            {otherRequests.length > 0 && (
                <Card>
                    <CardHeader>
                    <CardTitle>Responded Requests</CardTitle>
                    <CardDescription>A history of requests you have already responded to.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {otherRequests.map((request) => (
                            <RequestCard key={request.id} request={request} />
                        ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
      )}
    </div>
  );
}
