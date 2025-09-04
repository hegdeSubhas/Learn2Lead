"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Briefcase,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  Map,
  BookOpen,
} from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

export function MainNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/mentor', label: 'AI Mentor', icon: Bot },
    { href: '/roadmap', label: 'Roadmap', icon: Map },
    { href: '/jobs', label: 'Opportunities', icon: Briefcase },
    { href: '/scholarships', label: 'Scholarships', icon: GraduationCap },
    { href: '/quiz', label: 'Quiz', icon: FileQuestion },
    { href: '/resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-headline font-semibold text-sidebar-foreground">
            AspireRural
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarMenu>
        {menuItems.map((item) => (
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
