

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/storage";

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


export default async function PrivacyPolicyPage() {
    const content = await getSiteContent();
    const lastUpdatedDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
                <p className="text-muted-foreground pt-1">Last updated: {lastUpdatedDate}</p>
            </CardHeader>
            <CardContent className="space-y-4 max-w-none">
                 <PolicyContent content={content.privacyPolicy} />
            </CardContent>
        </Card>
    )
}
