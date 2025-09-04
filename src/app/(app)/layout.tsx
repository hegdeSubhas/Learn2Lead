import { MainNav } from '@/components/common/main-nav';
import { SiteHeader } from '@/components/common/site-header';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import { redirect } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // This is a placeholder for user authentication.
  // In a real app, you would check for a valid session.
  const isAuthenticated = true;

  if (!isAuthenticated) {
    // Redirect to the landing page if the user is not authenticated.
    redirect('/');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <MainNav />
      </Sidebar>
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
