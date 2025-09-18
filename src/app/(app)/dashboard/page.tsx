import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Bot,
  Briefcase,
  FileQuestion,
  GraduationCap,
  Lightbulb,
  BookOpen,
  ArrowRight,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { StudentDashboardContent } from './_components/student-dashboard-content';
import { MentorDashboardContent } from './_components/mentor-dashboard-content';

const features = [
  {
    title: 'AI Mentor',
    description: 'Get personalized career guidance.',
    icon: Bot,
    href: '/mentor',
    color: 'text-blue-500',
    roles: ['student', 'mentor']
  },
  {
    title: 'Career Roadmap',
    description: 'Generate a step-by-step career plan.',
    icon: Lightbulb,
    href: '/roadmap',
    color: 'text-green-500',
    roles: ['student']
  },
  {
    title: 'Opportunities',
    description: 'Find jobs and internships.',
    icon: Briefcase,
    href: '/jobs',
    color: 'text-purple-500',
     roles: ['student']
  },
  {
    title: 'Scholarships',
    description: 'Discover funding for your education.',
    icon: GraduationCap,
    href: '/scholarships',
    color: 'text-yellow-500',
     roles: ['student']
  },
  {
    title: 'Self-Evaluation Quiz',
    description: 'Test your skills and knowledge.',
    icon: FileQuestion,
    href: '/quiz',
    color: 'text-red-500',
     roles: ['student']
  },
  {
    title: 'Learning Resources',
    description: 'Browse curated study materials.',
    icon: BookOpen,
    href: '/resources',
    color: 'text-indigo-500',
     roles: ['student']
  },
  {
    title: 'Find a Mentor',
    description: 'Connect with experienced professionals.',
    icon: Users,
    href: '/mentors',
    color: 'text-pink-500',
    roles: ['student']
  }
];

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  const userRole = profile?.role || 'student';
  const visibleFeatures = features.filter(f => f.roles.includes(userRole));

  return (
    <div className="space-y-8">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="font-headline text-4xl">
            Welcome to Learn2Lead
          </CardTitle>
          <CardDescription className="text-lg">
            Your journey to a successful career starts here. Explore resources
            and find your path.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-60 w-full rounded-lg overflow-hidden">
             <Image
                src="https://picsum.photos/seed/dashboard/1200/400"
                alt="Students collaborating"
                fill
                className="object-cover"
                data-ai-hint="education learning"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <h2 className="text-2xl font-headline font-bold text-white">Unlock Your Potential</h2>
                <p className="text-white/90">Personalized guidance to help you achieve your dreams.</p>
              </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Role-specific content */}
      {userRole === 'student' && <StudentDashboardContent userId={user.id} />}
      {userRole === 'mentor' && <MentorDashboardContent />}


      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visibleFeatures.map((feature) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="h-full transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-headline">
                  {feature.title}
                </CardTitle>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0 flex justify-end">
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
