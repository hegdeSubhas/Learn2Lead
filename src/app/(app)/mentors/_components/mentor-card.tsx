
"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CircleUser, Send, Check, Clock, Mail, Phone } from 'lucide-react';
import { type MentorWithRequest } from '@/services/mentors';
import { requestMentorAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

function getInitials(name: string) {
  if (!name) return '';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function SubmitButton({ status }: { status: string | null }) {
  const { pending } = useFormStatus();

  if (status === 'accepted') {
    return (
      <Button className="w-full" disabled>
        <Check className="mr-2 h-4 w-4" />
        Connected
      </Button>
    );
  }
  if (status === 'pending') {
    return (
      <Button className="w-full" disabled>
        <Clock className="mr-2 h-4 w-4" />
        Request Sent
      </Button>
    );
  }

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        'Sending...'
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Send Request
        </>
      )}
    </Button>
  );
}

export function MentorCard({ mentor }: { mentor: MentorWithRequest }) {
  const { toast } = useToast();
  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(requestMentorAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center text-center">
        <Avatar className="h-20 w-20 text-3xl">
          <AvatarFallback className="bg-muted">
            {getInitials(mentor.full_name)}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="pt-2">{mentor.full_name}</CardTitle>
        <CardDescription>{mentor.education}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Bio</h4>
          <p className="text-sm text-muted-foreground">
            {mentor.ambition || 'No bio provided.'}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {mentor.skills ? mentor.skills.split(',').map(skill => (
              <Badge key={skill.trim()} variant="secondary">{skill.trim()}</Badge>
            )) : <p className="text-sm text-muted-foreground">No skills listed.</p>}
          </div>
        </div>
        {mentor.request_status === 'accepted' && (
           <div>
            <h4 className="text-sm font-semibold mb-2">Contact Information</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
                {mentor.email && (
                    <a href={`mailto:${mentor.email}`} className="flex items-center gap-2 hover:text-primary">
                       <Mail size={14}/>
                       <span>{mentor.email}</span>
                    </a>
                )}
                {mentor.phone && (
                    <a href={`tel:${mentor.phone}`} className="flex items-center gap-2 hover:text-primary">
                        <Phone size={14} />
                        <span>{mentor.phone}</span>
                    </a>
                )}
                 {!mentor.email && !mentor.phone && (
                    <p>No contact information provided.</p>
                )}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form action={formAction} className="w-full">
          <input type="hidden" name="mentorId" value={mentor.id} />
          <SubmitButton status={mentor.request_status} />
        </form>
      </CardFooter>
    </Card>
  );
}
