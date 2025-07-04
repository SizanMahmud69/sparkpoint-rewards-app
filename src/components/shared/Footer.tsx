import Link from "next/link";
import { Logo } from "../Logo";
import { Button } from "../ui/button";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-6 py-8 px-4 sm:flex-row sm:px-6 lg:px-8">
                <Logo />
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
                    <Button variant="link" asChild className="text-muted-foreground px-0 hover:text-primary">
                        <Link href="/privacy-policy">Privacy Policy</Link>
                    </Button>
                     <Button variant="link" asChild className="text-muted-foreground px-0 hover:text-primary">
                        <Link href="/contact-us">Contact Us</Link>
                    </Button>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SparkPoint. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
