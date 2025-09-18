
import { Chatbot } from './_components/chatbot';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

export default async function MentorPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user ? await supabase.from('profiles').select('role').eq('id', user.id).single() : { data: null };
  const userRole = profile?.role || 'student';
  
  const title = userRole === 'mentor' ? 'AI Assistant' : 'AI Mentor';
  const description = userRole === 'mentor' 
    ? 'Get help brainstorming quiz questions, structuring content, and generating teaching ideas.'
    : 'Ask questions, get advice, and practice your skills with your personal AI-powered mentor. Use the microphone for a hands-free experience.';

  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-10rem)]">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">
          {title}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          {description}
        </p>
      </div>
      <Card className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
        <CardContent className="flex-grow flex flex-col p-0">
          <Chatbot userRole={userRole} />
        </CardContent>
      </Card>
    </div>
  );
}
