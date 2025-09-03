import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { MapComponent } from "./_components/map";

function MapSkeleton() {
  return <Skeleton className="w-full h-[450px] rounded-lg" />;
}

export default function ConnectPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  return (
    <div className="space-y-8 flex flex-col items-center text-center">
      <div className="max-w-3xl">
        <h1 className="text-4xl font-headline font-bold">Connect with Peers</h1>
        <p className="text-muted-foreground mt-2">
          Find and connect with other students in your area to share skills, collaborate on projects, and build a supportive network.
        </p>
      </div>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Find Peers Near You</CardTitle>
          <CardDescription>
            Explore the map to see where other students are located.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apiKey ? (
             <Suspense fallback={<MapSkeleton />}>
                <div className="w-full h-[450px] rounded-lg overflow-hidden">
                    <MapComponent apiKey={apiKey} />
                </div>
            </Suspense>
          ) : (
             <div className="text-center p-8 bg-muted rounded-lg">
                <p className="text-muted-foreground">Please configure your Google Maps API key in the .env file to view the map.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
