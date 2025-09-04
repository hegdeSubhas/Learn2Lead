import { getInternships, type Internship } from "@/services/internships";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function OpportunityCard({ internship }: { internship: Internship }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{internship.title}</CardTitle>
        <CardDescription>
          {internship.company_name} - {internship.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {internship.type && <Badge variant="secondary">{internship.type}</Badge>}
        </div>
        <p className="line-clamp-3 text-sm mt-4 text-muted-foreground">{internship.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={internship.url} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}


export async function OpportunityList() {
    try {
        const internships = await getInternships();

        if (!internships || internships.length === 0) {
            return <p>No opportunities found at the moment. Please check back later!</p>
        }

        return (
            <div className="grid gap-6 md:grid-cols-2">
                {internships.map((internship) => (
                    <OpportunityCard key={internship.id} internship={internship} />
                ))}
            </div>
        );
    } catch (error) {
        let errorMessage = "An unknown error occurred while fetching opportunities.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Fetching Opportunities</AlertTitle>
                <AlertDescription>
                    {errorMessage}
                </AlertDescription>
            </Alert>
        )
    }
}
