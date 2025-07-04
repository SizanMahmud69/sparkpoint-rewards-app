
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactUsPage() {
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <p className="text-muted-foreground">Have questions? We'd love to hear from you. Reach out to us through any of the methods below.</p>
                
                <div className="space-y-4">
                    <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Email</h3>
                            <p className="text-muted-foreground">For general inquiries and support, please email us at:</p>
                            <a href="mailto:support@spark.point" className="text-primary hover:underline">support@spark.point</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Phone</h3>
                            <p className="text-muted-foreground">Our support line is open from 9 AM to 5 PM, Monday to Friday.</p>
                            <a href="tel:+1234567890" className="text-primary hover:underline">+1 (234) 567-890</a>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold">Office Address</h3>
                            <p className="text-muted-foreground">123 Spark Street, Reward City, 45678</p>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}
