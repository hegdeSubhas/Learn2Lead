
import { createClient } from "@/lib/supabase/server";

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
  student_id: StudentProfile; // This will now be an object
}

export async function getStudentRequests(mentorId: string): Promise<{ data: StudentRequest[] | null; error: string | null }> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('mentor_requests')
    .select(`
      id,
      status,
      created_at,
      student_id:profiles!mentor_requests_student_id_fkey (
        id,
        full_name,
        education,
        skills,
        ambition
      )
    `)
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching student requests:", error);
    return { data: null, error: "Failed to fetch student requests." };
  }

  // The type from Supabase might be slightly different, so we cast it.
  // The select query is structured to return the profile nested under `student_id`.
  const requests: StudentRequest[] = data.map((item: any) => ({
      ...item,
      student_id: Array.isArray(item.student_id) ? item.student_id[0] : item.student_id,
  }));


  return { data: requests, error: null };
}
