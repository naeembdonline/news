"use client";
import { breakingNews } from "@/lib/mockData";

export default function BreakingTicker() {
    const items = [...breakingNews, ...breakingNews];

    return (
        <div
            className="w-full flex items-center h-9 overflow-hidden"
            style={{ background: "var(--accent-red)" }}
        >
            {/* Label */}
            <div
                className="flex-shrink-0 flex items-center gap-2 px-4 h-full"
                style={{ background: "#991B1B", minWidth: "110px" }}
            >
                <span className="pulse-dot" />
                <span
                    className="text-white text-xs font-semibold tracking-wide"
                    style={{ fontFamily: "var(--font-headline)" }}
                >
                    ব্রেকিং
                </span>
            </div>

            {/* Scrolling text */}
            <div className="ticker-wrap flex-1">
                <div className="ticker-inner">
                    {items.map((item, i) => (
                        <span
                            key={i}
                            className="inline-block text-white text-sm px-8"
                            style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem" }}
                        >
                            <span className="opacity-40 mr-3">•</span>
                            {item}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
