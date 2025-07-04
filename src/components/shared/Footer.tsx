import Link from "next/link";
import { Logo } from "../Logo";
import { Button } from "../ui/button";
import { LayoutDashboard, User, Wallet, FileText, Phone } from 'lucide-react';

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-6 py-8 px-4 sm:flex-row sm:px-6 lg:px-8">
                <Logo />
                <nav className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm md:gap-x-4">
                    <Button variant="ghost" asChild>
                        <Link href="/dashboard">
                            <LayoutDashboard />
                            Dashboard
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/profile">
                            <User />
                            Profile
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/wallet">
                            <Wallet />
                            Wallet
                        </Link>
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/privacy-policy">
                            <FileText />
                            Privacy
                        </Link>
                    </Button>
                     <Button variant="ghost" asChild>
                        <Link href="/contact-us">
                            <Phone />
                            Contact
                        </Link>
                    </Button>
                </nav>
                <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} SparkPoint. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
