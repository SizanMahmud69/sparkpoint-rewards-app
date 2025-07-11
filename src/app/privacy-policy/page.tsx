
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/storage";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const PolicyContent = ({ content }: { content: string }) => {
    const formattedContent = content.split('\n').map((paragraph, index) => {
        if (paragraph.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 font-headline">{paragraph.substring(3)}</h2>;
        }
        if (paragraph.trim() === '') {
            return null;
        }
        return <p key={index} className="leading-relaxed">{paragraph}</p>;
    }).filter(Boolean);

    return <>{formattedContent}</>;
};


export default function PrivacyPolicyPage() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const siteContent = await getSiteContent();
            setContent(siteContent);
            setLoading(false);
        }
        fetchContent();
    }, []);

    const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
                 {loading ? <Skeleton className="h-5 w-48 mt-1" /> : <p className="text-muted-foreground pt-1">Last updated: {lastUpdatedDate}</p>}
            </CardHeader>
            <CardContent className="space-y-4 max-w-none">
                 {loading || !content ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-6 w-1/3 mt-6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                 ) : (
                    <PolicyContent content={content.privacyPolicy} />
                 )}
            </CardContent>
        </Card>
    )
}
