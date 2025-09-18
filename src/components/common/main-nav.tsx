"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Briefcase,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  BookOpen,
  CircleUser,
  LogOut,
  Users,
  Bell,
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button';
import { logoutAction } from '@/app/(auth)/login/actions';
import { Avatar, AvatarFallback } from '../ui/avatar';


function getInitials(name: string) {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}


export function MainNav({ user, profile }: { user: User, profile: any }) {
  const pathname = usePathname();

  const allMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true, roles: ['student', 'mentor'] },
    { href: '/mentor', label: 'AI Mentor', icon: Bot, roles: ['student', 'mentor'] },
    { href: '/roadmap', label: 'Career Roadmap', icon: Lightbulb, roles: ['student'] },
    { href: '/jobs', label: 'Opportunities', icon: Briefcase, roles: ['student'] },
    { href: '/scholarships', label: 'Scholarships', icon: GraduationCap, roles: ['student'] },
    { href: '/quiz', label: 'Quiz', icon: FileQuestion, roles: ['student'] },
    { href: '/resources', label: 'Resources', icon: BookOpen, roles: ['student'] },
    { href: '/mentors', label: 'Find a Mentor', icon: Users, roles: ['student'] },
    { href: '/requests', label: 'Student Requests', icon: Bell, roles: ['mentor'] },
  ];

  const visibleMenuItems = allMenuItems.filter(item => item.roles.includes(profile?.role));

  return (
    <>
      <SidebarHeader className="p-4 flex items-center gap-3">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-primary">
                        <AvatarFallback className="bg-transparent border-2 border-sidebar-foreground">
                            {profile?.full_name ? getInitials(profile.full_name) : <CircleUser />}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.full_name || 'User'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <CircleUser className="mr-2 h-4 w-4" />
                        <span>Edit Profile</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <form action={logoutAction}>
                    <DropdownMenuItem asChild>
                        <button type="submit" className="w-full">
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>

        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-headline font-semibold text-sidebar-foreground">
            Learn2Lead
          </h1>
        </Link>

      </SidebarHeader>
      <SidebarMenu>
        {visibleMenuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={item.exact ? pathname === item.href : pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
