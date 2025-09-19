
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
import { Check, Clock, X, Loader2 } from 'lucide-react';
import { type StudentRequest } from '@/services/requests';
import { updateRequestAction } from '../actions';
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

function ActionButtons({ status, requestId }: { status: string; requestId: number }) {
  const { pending } = useFormStatus();

  if (status === 'accepted') {
    return (
      <Button className="w-full" disabled>
        <Check className="mr-2 h-4 w-4" />
        Accepted
      </Button>
    );
  }

  if (status === 'rejected') {
    return (
      <Button className="w-full" variant="secondary" disabled>
        <X className="mr-2 h-4 w-4" />
        Rejected
      </Button>
    );
  }

  return (
    <div className="flex gap-2 w-full">
      <Button type="submit" name="status" value="accepted" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : 'Accept'}
      </Button>
      <Button type="submit" name="status" value="rejected" variant="destructive" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : 'Reject'}
      </Button>
    </div>
  );
}

export function RequestCard({ request }: { request: StudentRequest }) {
  const { toast } = useToast();
  const initialState = { success: false, message: '' };
  const [state, formAction] = useActionState(updateRequestAction, initialState);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);
  
  const student = request.student;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center text-center">
        <Avatar className="h-20 w-20 text-3xl">
          <AvatarFallback className="bg-muted">
            {student.full_name ? getInitials(student.full_name) : '??'}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="pt-2">{student.full_name}</CardTitle>
        <CardDescription>{student.education}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-2">Goal / Ambition</h4>
          <p className="text-sm text-muted-foreground">
            {student.ambition || 'No bio provided.'}
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {student.skills ? student.skills.split(',').map(skill => (
              <Badge key={skill.trim()} variant="secondary">{skill.trim()}</Badge>
            )) : <p className="text-sm text-muted-foreground">No skills listed.</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <form action={formAction} className="w-full">
          <input type="hidden" name="requestId" value={request.id} />
          <ActionButtons status={request.status} requestId={request.id} />
        </form>
      </CardFooter>
    </Card>
  );
}
