"use client";

import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { generateRoadmapAction } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Terminal, Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Generate Roadmap
    </Button>
  );
}

export function RoadmapForm() {
  const initialState = { success: false };
  const [state, formAction] = useActionState(generateRoadmapAction, initialState);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const { pending } = useFormStatus();

  const handleDownload = async () => {
    const roadmapElement = roadmapRef.current;
    const resourcesElement = resourcesRef.current;

    if (!roadmapElement || !resourcesElement) {
        return;
    }

    try {
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const addImageToPdf = async (element: HTMLElement, title: string) => {
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: null,
                useCORS: true,
            });
            const imgData = canvas.toDataURL("image/png");
            const imgWidth = pdfWidth - 20;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            let position = 15;
            
            pdf.setFont("helvetica", "bold");
            pdf.setFontSize(16);
            pdf.text(title, 10, 10);
            
            let heightLeft = imgHeight;
            
            while (heightLeft > 0) {
                pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight, undefined, 'FAST');
                heightLeft -= (pdfHeight - 20); // a4 height
                if (heightLeft > 0) {
                    pdf.addPage();
                    position = 10;
                }
            }
        };

        await addImageToPdf(roadmapElement, "Your Personalized Roadmap");
        pdf.addPage();
        await addImageToPdf(resourcesElement, "Suggested Resources");

        pdf.save("career-roadmap.pdf");

    } catch (error) {
        console.error("Error generating PDF:", error);
    }
  };


  return (
    <div className="space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobRole">Job Role(s)</Label>
          <Input id="jobRole" name="jobRole" placeholder="e.g., Software Engineer, Data Scientist" required />
          <p className="text-xs text-muted-foreground">Enter one or more job roles, separated by commas.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="interests">Your Interests</Label>
          <Textarea
            id="interests"
            name="interests"
            placeholder="e.g., Web development, mobile apps, artificial intelligence"
            required
          />
        </div>
        <SubmitButton />
      </form>

      {state?.error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {typeof state.error === 'string' ? state.error : 'Please check your inputs and try again.'}
          </AlertDescription>
        </Alert>
      )}

      {state?.success && state.result && (
        <div className="space-y-6 pt-4">
            <div className="flex justify-end">
                <Button onClick={handleDownload} variant="outline" disabled={pending}>
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Your Personalized Roadmap</CardTitle>
                </CardHeader>
                <CardContent ref={roadmapRef} className="prose prose-sm dark:prose-invert max-w-none text-card-foreground prose-headings:font-headline prose-headings:text-base prose-ul:my-2 prose-li:my-1 prose-p:my-2">
                    <div dangerouslySetInnerHTML={{ __html: state.result.roadmap }} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Suggested Resources</CardTitle>
                </CardHeader>
                <CardContent ref={resourcesRef} className="prose prose-sm dark:prose-invert max-w-none text-card-foreground prose-headings:font-headline prose-headings:text-base prose-ul:my-2 prose-li:my-1 prose-p:my-2">
                    <div dangerouslySetInnerHTML={{ __html: state.result.resources }} />
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
