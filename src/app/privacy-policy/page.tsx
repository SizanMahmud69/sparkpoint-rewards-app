import { UserHeader } from "@/components/user/UserHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <UserHeader />
            <main className="flex-grow bg-muted/20">
                <div className="container mx-auto w-full max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
                    <Card className="max-w-4xl mx-auto">
                        <CardHeader>
                            <CardTitle className="font-headline text-3xl">Privacy Policy</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 prose prose-blue max-w-none dark:prose-invert">
                            <p>Last updated: {new Date().toLocaleDateString()}</p>
                            
                            <h2 className="font-headline">Introduction</h2>
                            <p>Welcome to SparkPoint Rewards Hub. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.</p>

                            <h2 className="font-headline">Information We Collect</h2>
                            <p>We collect personal information that you voluntarily provide to us when you register on the website, express an interest in obtaining information about us or our products and services, when you participate in activities on the website (such as posting messages in our online forums or entering competitions, contests or giveaways) or otherwise when you contact us.</p>
                            
                            <h2 className="font-headline">How We Use Your Information</h2>
                            <p>We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.</p>

                            <h2 className="font-headline">Will Your Information Be Shared With Anyone?</h2>
                            <p>We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations.</p>

                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
