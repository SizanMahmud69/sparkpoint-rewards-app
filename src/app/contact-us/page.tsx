
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteContent } from "@/lib/storage";
import { Mail, Phone, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import type { SiteContent } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactUsPage() {
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

    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-muted-foreground">Have questions? We'd love to hear from you. Reach out to us through any of the methods below.</p>
                
                {loading || !content ? (
                    <div className="space-y-6">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p className="text-muted-foreground">For general inquiries and support, please email us at:</p>
                                <a href={`mailto:${content.contactEmail}`} className="text-primary hover:underline">{content.contactEmail}</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">Phone</h3>
                                <p className="text-muted-foreground">Our support line is open from 9 AM to 5 PM, Monday to Friday.</p>
                                <a href={`tel:${content.contactPhone}`} className="text-primary hover:underline">{content.contactPhone}</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold">Office Address</h3>
                                <p className="text-muted-foreground">{content.contactAddress}</p>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
