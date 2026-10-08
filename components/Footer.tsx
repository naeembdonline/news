import Link from "next/link";

const CATEGORY_LINKS = [
    { label: "জাতীয়", href: "/category/national" },
    { label: "রাজনীতি", href: "/category/politics" },
    { label: "অর্থনীতি", href: "/category/economy" },
    { label: "আন্তর্জাতিক", href: "/category/international" },
    { label: "খেলাধুলা", href: "/category/sports" },
];

export default function Footer() {
    return (
        <footer
            className="mt-20 pt-12 pb-6"
            style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border-primary)" }}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="inline-block">
                            <h3
                                className="text-2xl font-extrabold mb-2"
                                style={{ fontFamily: "var(--font-headline)", color: "var(--accent-navy)" }}
                            >
                                নয়া বাংলা
                            </h3>
                        </Link>
                        <p
                            className="text-sm leading-relaxed mb-4"
                            style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                        >
                            সত্য, নিরপেক্ষ ও দায়িত্বশীল সাংবাদিকতায় প্রতিশ্রুতিবদ্ধ।
                        </p>
                    </div>

                    {/* Category Column */}
                    <div>
                        <h4
                            className="text-sm font-bold mb-3"
                            style={{ fontFamily: "var(--font-headline)", color: "var(--accent-navy)" }}
                        >
                            বিভাগসমূহ
                        </h4>
                        <ul className="space-y-1.5">
                            {CATEGORY_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors hover:text-red-700"
                                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h4
                            className="text-sm font-bold mb-3"
                            style={{ fontFamily: "var(--font-headline)", color: "var(--accent-navy)" }}
                        >
                            সেবাসমূহ
                        </h4>
                        <ul className="space-y-1.5">
                            {["ই-পেপার", "আর্কাইভ", "পডকাস্ট", "ভিডিও", "নিউজলেটার"].map((service) => (
                                <li key={service}>
                                    <span
                                        className="text-sm cursor-pointer transition-colors hover:text-red-700"
                                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                                    >
                                        {service}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* About Column */}
                    <div>
                        <h4
                            className="text-sm font-bold mb-3"
                            style={{ fontFamily: "var(--font-headline)", color: "var(--accent-navy)" }}
                        >
                            প্রতিষ্ঠান
                        </h4>
                        <ul className="space-y-1.5">
                            {["আমাদের সম্পর্কে", "যোগাযোগ", "বিজ্ঞাপন", "গোপনীয়তা", "শর্তাবলী"].map((item) => (
                                <li key={item}>
                                    <span
                                        className="text-sm cursor-pointer transition-colors hover:text-red-700"
                                        style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
                                    >
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: "var(--border-primary)" }} />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 pt-5 text-xs" style={{ color: "var(--text-muted)" }}>
                    <p style={{ fontFamily: "var(--font-body)" }}>
                        © ২০২৬ নয়া বাংলা। সমস্ত স্বত্ব সংরক্ষিত।
                    </p>
                    <p
                        className="font-medium"
                        style={{ color: "var(--accent-red)", fontFamily: "var(--font-headline)" }}
                    >
                        সত্যের সন্ধানে, সবসময়
                    </p>
                </div>
            </div>
        </footer>
    );
}
