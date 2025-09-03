import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

export default function ConnectPage() {
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
          <CardTitle>Feature Coming Soon!</CardTitle>
          <CardDescription>
            We are working on an interactive map to help you find peers. This feature requires a Google Maps API key to be configured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src="https://picsum.photos/800/450"
              alt="Map placeholder"
              fill
              className="object-cover opacity-50"
              data-ai-hint="world map"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-lg font-semibold text-muted-foreground">Interactive Map Coming Soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
