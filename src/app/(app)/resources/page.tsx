import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

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
    category: "Web Development",
  },
  {
    name: "Coursera",
    description: "Build skills with courses, certificates, and degrees online from world-class universities and companies.",
    url: "https://www.coursera.org/",
    category: "General Learning",
  },
  {
    name: "GeeksforGeeks",
    description: "A computer science portal for geeks with a vast collection of articles, tutorials, and interview questions.",
    url: "https://www.geeksforgeeks.org/",
    category: "Computer Science",
  },
  {
    name: "Khan Academy",
    description: "Free online courses, lessons & practice for math, science, computer programming, history, and more.",
    url: "https://www.khanacademy.org/",
    category: "General Learning",
  },
  {
    name: "Kaggle",
    description: "A platform for data scientists and machine learning engineers to find and publish data sets, and build models.",
    url: "https://www.kaggle.com/",
    category: "Data Science",
  },
  {
    name: "Smashing Magazine",
    description: "An online magazine for web designers and developers that offers the latest trends and techniques.",
    url: "https://www.smashingmagazine.com/",
    category: "Web Design",
  },
];

const videoResources: Resource[] = [
  {
    name: "Fireship",
    description: "High-intensity code tutorials to help you build & ship apps faster. New videos every week on Flutter, Firebase, and modern web tech.",
    url: "https://www.youtube.com/c/Fireship",
    category: "Web Development",
  },
  {
    name: "CodeWithHarry",
    description: "Quality programming tutorials in Hindi. Covers a wide range of topics from web development to data science.",
    url: "https://www.youtube.com/c/CodeWithHarry",
    category: "Computer Science",
  },
  {
    name: "3Blue1Brown",
    description: "Intuitive explanations of complex math topics, making abstract concepts easier to understand.",
    url: "https://www.youtube.com/c/3blue1brown",
    category: "Mathematics",
  },
  {
    name: "Apna College",
    description: "High-quality educational content in Hindi for students, focusing on programming, data structures, and algorithms.",
    url: "https://www.youtube.com/c/ApnaCollege",
    category: "Computer Science",
  },
];

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="flex items-center justify-between p-4 border-b">
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

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-headline font-bold">Learning Resources</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          A curated list of high-quality websites and YouTube channels to aid your learning journey.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Study Materials</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {studyMaterials.map((site) => (
              <ResourceCard key={site.name} resource={site} />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Video Resources</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {videoResources.map((channel) => (
              <ResourceCard key={channel.name} resource={channel} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
