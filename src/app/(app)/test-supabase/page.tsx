import { testSupabaseConnection, testProfilesTable } from '@/ai/flows/test-supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const revalidate = 0; // Disable caching for this page

export default async function TestSupabasePage() {
  const connectionResult = await testSupabaseConnection();
  const tableResult = await testProfilesTable();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Supabase Diagnostic</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          This page runs simple tests to verify the connection to your Supabase project.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm p-4 bg-muted rounded-md">{connectionResult}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profiles Table Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-mono text-sm p-4 bg-muted rounded-md">{tableResult}</p>
        </CardContent>
      </Card>
    </div>
  );
}
