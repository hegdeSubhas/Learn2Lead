import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ProfileForm } from './_components/profile-form';
import { cookies } from 'next/headers';

export default async function ProfilePage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: single row not found
    console.error('Error fetching profile:', error);
    // Optionally, handle this error more gracefully
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Your Profile</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          View and update your personal information.
        </p>
      </div>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>
            Make changes to your profile here. Click save when you're done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
