
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export interface MentorProfile {
  id: string;
  full_name: string;
  education: string | null;
  skills: string | null;
  ambition: string | null;
  phone: string | null;
  email: string | null;
}

export interface MentorWithRequest extends MentorProfile {
  request_status: 'pending' | 'accepted' | 'rejected' | null;
}

export async function getMentors(studentId: string): Promise<{ data: MentorWithRequest[] | null; error: string | null }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  // 1. Fetch all profiles with the 'mentor' role
  const { data: mentors, error: mentorsError } = await supabase
    .from('profiles')
    .select('id, full_name, education, skills, ambition, phone, email')
    .eq('role', 'mentor');

  if (mentorsError) {
    console.error("Error fetching mentors:", mentorsError);
    return { data: null, error: "Failed to fetch mentors." };
  }

  if (!mentors || mentors.length === 0) {
    return { data: [], error: null };
  }

  const mentorIds = mentors.map(m => m.id);

  // 2. Fetch all requests made by the current student to these mentors
  const { data: requests, error: requestsError } = await supabase
    .from('mentor_requests')
    .select('mentor_id, status')
    .eq('student_id', studentId)
    .in('mentor_id', mentorIds);

  if (requestsError) {
    console.error("Error fetching requests:", requestsError);
    return { data: null, error: "Failed to fetch mentorship status." };
  }

  // 3. Create a map for quick lookups of request status
  const requestStatusMap = new Map<string, 'pending' | 'accepted' | 'rejected'>();
  if (requests) {
    for (const req of requests) {
      requestStatusMap.set(req.mentor_id, req.status as 'pending' | 'accepted' | 'rejected');
    }
  }

  // 4. Combine the mentor profiles with their request status
  const mentorsWithStatus: MentorWithRequest[] = mentors.map(mentor => ({
    ...mentor,
    request_status: requestStatusMap.get(mentor.id) || null,
  }));

  return { data: mentorsWithStatus, error: null };
}
