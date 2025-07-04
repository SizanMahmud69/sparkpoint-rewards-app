import Link from "next/link";
import { Logo } from "../Logo";

export function Footer() {
    return (
        <footer className="w-full border-t bg-card text-card-foreground">
            <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex-shrink-0">
                        <Logo />
                    </div>
                    <div className="flex space-x-6 text-sm">
                        <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/contact-us" className="text-muted-foreground hover:text-primary transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SparkPoint Rewards Hub. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
