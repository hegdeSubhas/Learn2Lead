import { MainNav } from '@/components/common/main-nav';
import { SiteHeader } from '@/components/common/site-header';
import {
  Sidebar,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
