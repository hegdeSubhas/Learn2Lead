
import { getMentorAnnouncements } from "@/services/content";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Clock, Megaphone } from "lucide-react";

export async function MentorAnnouncementList({ mentorId }: { mentorId: string }) {
    const { data: announcements, error } = await getMentorAnnouncements(mentorId);

    if (error) {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    if (!announcements || announcements.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-6">
                <Megaphone className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">You haven't posted any announcements yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-96 overflow-y-auto">
            {announcements.map((item) => (
                <div key={item.id} className="border p-4 rounded-lg">
                    <p className="text-sm">{item.content}</p>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-2">
                        <Clock size={12} />
                        Posted on {new Date(item.created_at).toLocaleString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
