import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Terminal } from "lucide-react";
import { getYoutubeVideos, YouTubeVideo } from "@/services/youtube";
import { ResourceTabs } from "./_components/resource-tabs";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { VideoResourceTabs } from "./_components/video-resource-tabs";
import { TutorialForm } from "./_components/tutorial-form";

interface Resource {
  name: string;
  description: string;
  url: string;
  category: string;
}

const studyMaterials: Resource[] = [
  {
    name: "freeCodeCamp",
    description: "Learn to code for free. Build projects. Earn certifications.",
    url: "https://www.freecodecamp.org/",
    category: "Computer Science",
  },
  {
    name: "GeeksforGeeks",
    description: "A computer science portal with articles, tutorials, and interview questions.",
    url: "https://www.geeksforgeeks.org/",
    category: "Computer Science",
  },
  {
    name: "Kaggle",
    description: "A platform for data scientists to find datasets and build models.",
    url: "https://www.kaggle.com/",
    category: "Data Science",
  },
  {
    name: "Investopedia",
    description: "A leading source for financial content, from market news to investing education.",
    url: "https://www.investopedia.com/",
    category: "Commerce",
  },
  {
    name: "Corporate Finance Institute",
    description: "Provides online courses and certifications for finance and accounting professionals.",
    url: "https://corporatefinanceinstitute.com/",
    category: "Commerce",
  },
  {
    name: "Project Gutenberg",
    description: "A library of over 60,000 free eBooks, with a focus on older works for which U.S. copyright has expired.",
    url: "https://www.gutenberg.org/",
    category: "Arts & Humanities",
  },
  {
    name: "Google Arts & Culture",
    description: "Explore collections from around the world, created by museums and archives.",
    url: "https://artsandculture.google.com/",
    category: "Arts & Humanities",
  },
  {
    name: "Coursera",
    description: "Build skills with courses online from world-class universities and companies.",
    url: "https://www.coursera.org/",
    category: "General Learning",
  },
   {
    name: "Khan Academy",
    description: "Free online courses, lessons & practice for math, science, and more.",
    url: "https://www.khanacademy.org/",
    category: "General Learning",
  },
];


const groupedStudyMaterials = studyMaterials.reduce((acc, material) => {
    if (!acc[material.category]) {
        acc[material.category] = [];
    }
    acc[material.category].push(material);
    return acc;
}, {} as Record<string, Resource[]>);

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex-1">
        <h3 className="font-semibold">{resource.name}</h3>
        <p className="text-sm text-muted-foreground">{resource.description}</p>
      </div>
      <Button asChild variant="ghost" size="icon">
        <a href={resource.url} target="_blank" rel="noopener noreferrer">
          <ArrowUpRight className="h-4 w-4" />
          <span className="sr-only">Visit</span>
        </a>
      </Button>
    </div>
  );
}

function VideoResourceCard({ video }: { video: YouTubeVideo }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="block relative h-40 w-full">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover"
        />
      </a>
      <CardHeader>
          <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
            <CardTitle className="line-clamp-2 text-base leading-snug hover:underline">{video.title}</CardTitle>
          </a>
      </CardHeader>
      <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground">by {video.channelTitle}</p>
      </CardContent>
    </Card>
  );
}

async function VideoResourcesList({ category }: { category: string }) {
    try {
        const videos = await getYoutubeVideos(category);
        if (videos.length === 0) {
            return <p>No videos found for this category.</p>
        }
        return (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {videos.map((video) => (
                  <VideoResourceCard key={video.videoId} video={video} />
                ))}
            </div>
        )
    } catch (error) {
        return (
             <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Could Not Fetch Videos</AlertTitle>
                <AlertDescription>
                    <p>There was an error fetching the video resources. This might be because the YouTube API key is not configured or is invalid.</p>
                    <p className="mt-2 text-xs">Please add your `YOUTUBE_API_KEY` to the `.env` file.</p>
                </AlertDescription>
            </Alert>
        )
    }
}

function VideoResourcesSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="w-full h-32" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/4" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function AITutorialFinder() {
    return (
        <Card className="max-w-3xl mx-auto">
            <CardHeader>
                <CardTitle>AI-Powered Tutorial Finder</CardTitle>
                <CardDescription>Enter a topic or skill you want to learn, and our AI will suggest a list of relevant learning resources.</CardDescription>
            </CardHeader>
            <CardContent>
                <TutorialForm />
            </CardContent>
        </Card>
    )
}

export default function ResourcesPage({
  searchParams,
}: {
  searchParams: { [key:string]: string | string[] | undefined };
}) {

  const category = typeof searchParams.category === 'string' ? searchParams.category : 'study';
  const videoCategory = typeof searchParams.video_category === 'string' ? searchParams.video_category : 'general';


  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Learning Resources</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          A curated list of high-quality websites and YouTube channels to aid your learning journey.
        </p>
      </div>
      
      <ResourceTabs currentCategory={category}>
          {category === 'study' && (
              <Card>
                <CardHeader>
                    <CardTitle>Study Materials</CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-4">
                    {Object.entries(groupedStudyMaterials).map(([category, resources]) => (
                      <div key={category}>
                          <h3 className="font-headline text-lg font-semibold mb-2 px-6 pt-4">{category}</h3>
                          <div className="border-t">
                            {resources.map((site) => (
                                <ResourceCard key={site.name} resource={site} />
                            ))}
                          </div>
                      </div>
                    ))}
                </CardContent>
             </Card>
          )}

          {category === 'videos' && (
            <VideoResourceTabs currentCategory={videoCategory}>
                <Suspense fallback={<VideoResourcesSkeleton/>}>
                    <VideoResourcesList category={videoCategory} />
                </Suspense>
            </VideoResourceTabs>
          )}

          {category === 'ai-finder' && (
            <AITutorialFinder />
          )}
      </ResourceTabs>

    </div>
  );
}
