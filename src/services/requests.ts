
'use server';

import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

interface StudentProfile {
  id: string;
  full_name: string | null;
  education: string | null;
  skills: string | null;
  ambition: string | null;
}

export interface StudentRequest {
  id: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  student: StudentProfile;
}

export async function getStudentRequests(
  mentorId: string
): Promise<{ data: StudentRequest[] | null; error: string | null }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from('mentor_requests')
    .select(
      `
      id,
      status,
      created_at,
      student:profiles!mentor_requests_student_id_fkey (
        id,
        full_name,
        education,
        skills,
        ambition
      )
    `
    )
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching student requests:', error);
    return { data: null, error: 'Failed to fetch student requests.' };
  }

  const requests: StudentRequest[] = (data || [])
    .map((item: any) => {
      if (!item.student || typeof item.student !== 'object') {
        return null;
      }
      return {
        id: item.id,
        status: item.status,
        created_at: item.created_at,
        student: item.student as StudentProfile,
      };
    })
    .filter((req): req is StudentRequest => req !== null);

  return { data: requests, error: null };
}
