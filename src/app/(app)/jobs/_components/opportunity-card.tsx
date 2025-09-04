import type { Internship } from "@/services/internships";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function OpportunityCard({ opportunity }: { opportunity: Internship }) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{opportunity.title}</CardTitle>
        <CardDescription>
          {opportunity.company_name} - {opportunity.location}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {opportunity.type && <Badge variant="secondary">{opportunity.type}</Badge>}
        </div>
        <p className="line-clamp-3 text-sm mt-4 text-muted-foreground">{opportunity.description}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <a href={opportunity.url} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
