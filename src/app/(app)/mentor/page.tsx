import { Chatbot } from './_components/chatbot';
import { Card, CardContent } from '@/components/ui/card';

export default function MentorPage() {
  return (
    <div className="space-y-8 flex flex-col h-[calc(100vh-10rem)]">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">
          AI Chatbot
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          Ask questions, get advice, and practice your skills with your personal AI-powered chat assistant. Use the microphone for a hands-free experience.
        </p>
      </div>
      <Card className="max-w-3xl mx-auto w-full flex-grow flex flex-col">
        <CardContent className="flex-grow flex flex-col p-0">
          <Chatbot />
        </CardContent>
      </Card>
    </div>
  );
}
