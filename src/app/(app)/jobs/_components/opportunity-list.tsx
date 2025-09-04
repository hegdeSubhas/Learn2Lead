import { getInternships, type Internship } from "@/services/internships";
import { OpportunityCard } from "./opportunity-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export async function OpportunityList({ category }: { category: string }) {
    try {
        const opportunities = await getInternships(category);

        if (!opportunities || opportunities.length === 0) {
            return <p>No {category} found at the moment. Please check back later!</p>
        }

        return (
            <div className="grid gap-6 md:grid-cols-2">
                {opportunities.map((opportunity) => (
                    <OpportunityCard key={opportunity.id} opportunity={opportunity} />
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
