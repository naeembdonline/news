"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Newspaper,
    AlertCircle,
    PenTool,
    Landmark,
    Save,
    FileCheck,
    Send,
    Sparkles,
    PenLine,
    Eye,
    ArrowLeft,
    Bold,
    Italic,
    Quote,
    List,
    Heading2,
    Heading3,
    Pilcrow,
    ChevronRight,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mockData";
import { generateCleanSlug, calculateArticleStats, toBengaliNumber } from "@/lib/bengaliUtils";
import { saveArticle, NewsArticleItem } from "@/lib/articleStorage";
import LocalImageUploader from "@/components/admin/LocalImageUploader";
import Image from "next/image";

type ContentTypePreset = "standard" | "breaking" | "opinion" | "editorial";
type BylineMode =
    | "online-desk"
    | "own-reporter"
    | "special-correspondent"
    | "district-correspondent"
    | "named-reporter"
    | "opinion-author"
    | "editorial";

const CONTENT_TYPE_PRESETS: {
    id: ContentTypePreset;
    label: string;
    icon: typeof Newspaper;
    desc: string;
}[] = [
    {
        id: "standard",
        label: "সাধারণ সংবাদ",
        icon: Newspaper,
        desc: "প্রতিদিনের জাতীয়, রাজনীতি, অর্থনীতি ও আন্তর্জাতিক সংবাদের আদর্শ ফরম্যাট।",
    },
    {
        id: "breaking",
        label: "ব্রেকিং নিউজ",
        icon: AlertCircle,
        desc: "জরুরি ও তাৎক্ষণিক ঘটনার আপডেট, যা হোমপেজে শীর্ষ ব্রেকিং বারে স্থান পাবে।",
    },
    {
        id: "opinion",
        label: "মতামত ও কলাম",
        icon: PenTool,
        desc: "লেখক ও কলামিস্টদের মতামত, বিশ্লেষণ ও কলাম—লেখকের প্রোফাইল সহ।",
    },
    {
        id: "editorial",
        label: "সম্পাদকীয়",
        icon: Landmark,
        desc: "পত্রিকার অফিসিয়াল সম্পাদকীয় ও প্রাতিষ্ঠানিক মূল্যায়ন—ব্যক্তিগত লেখকহীন।",
    },
];

const SAMPLE_PRESET_IMAGES = [
    {
        url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&q=80",
        caption: "বাংলাদেশ জাতীয় ক্রিকেট দলের সাম্প্রতিক টেস্ট ম্যাচ ও প্র্যাকটিস সেশন।",
        credit: "ক্রিকেটার্স প্রেস / শামসুল হক",
    },
    {
        url: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1000&q=80",
        caption: "জাতীয় সংসদ ভবন ও সংসদীয় বাজেট অধিবেশন কক্ষ।",
        credit: "নয়া বাংলা আর্কাইভ",
    },
    {
        url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
        caption: "ঢাকা শহরের আধুনিক প্রযুক্তি সম্মেলন ও উদ্যোক্তা মেলা।",
        credit: "আইসিটি ডিভিশন",
    },
];

const SAMPLE_OPINION_PHOTOS = [
    { name: "ড. কামাল হোসেন", url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", role: "সমাজচিন্তক ও শিক্ষাবিদ" },
    { name: "অধ্যাপক সেলিনা পারভীন", url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80", role: "অর্থনীতি বিশ্লেষক ও অধ্যাপক" },
    { name: "মাহমুদুর রহমান", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", role: "আন্তর্জাতিক সম্পর্ক গবেষক" },
];

export default function CreateArticlePage() {
    const router = useRouter();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 1. Content Type Preset
    const [contentType, setContentType] = useState<ContentTypePreset>("standard");

    // 2. Smart Byline States
    const [bylineMode, setBylineMode] = useState<BylineMode>("online-desk");
    const [districtName, setDistrictName] = useState("");
    const [namedReporter, setNamedReporter] = useState("");
    const [opinionAuthorName, setOpinionAuthorName] = useState("প্রফেসর ড. মুস্তাক আহমেদ");
    const [opinionDesignation, setOpinionDesignation] = useState("নগর পরিকল্পনাবিদ ও অধ্যাপক, বুয়েট");
    const [opinionPhotoUrl, setOpinionPhotoUrl] = useState(
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"
    );

    // 3. Article Core Form states
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
    const [subtitle, setSubtitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState("জাতীয়");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>(["#জাতীয়", "#বাংলাদেশ"]);
    const [isBreaking, setIsBreaking] = useState(false);
    const [isLead, setIsLead] = useState(false);

    // 4. Hero image states (supported by Direct Local Uploader)
    const [imageUrl, setImageUrl] = useState(
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&q=80"
    );
    const [imageCaption, setImageCaption] = useState(
        "মিরপুর শেরেবাংলা জাতীয় স্টেডিয়ামে অনুশীলনরত বাংলাদেশ দল।"
    );
    const [photoCredit, setPhotoCredit] = useState("নয়া বাংলা / তানভীর আহমেদ");

    // 5. Rich text body and editor tab
    const [bodyContent, setBodyContent] = useState(
        `রাজধানীর মিরপুরে আজ থেকে শুরু হয়েছে তিন দিনের বিশেষ প্রস্তুতি ক্যাম্প। দলের প্রধান কোচ ও অধিনায়কের যৌথ সংবাদ সম্মেলনে আসন্ন আন্তর্জাতিক সিরিজ নিয়ে আশাবাদ ব্যক্ত করা হয়।\n\n## প্রথম সেশনের কৌশলগত পর্যালোচনা\nআজ সকাল ৯টায় দলের খেলোয়াড়রা মাঠে উপস্থিত হয়ে ফিল্ডিং ও নেটে ব্যাটিং অনুশীলন শুরু করেন। সাম্প্রতিক উইকেটের কন্ডিশন বিবেচনায় স্পিনার ও পেসারদের সমন্বয়ে দল সাজানোর পরিকল্পনা রয়েছে।\n\n> "আমরা প্রতিটি ম্যাচকে সমান গুরুত্ব দিয়ে পরিকল্পনা করছি। দলের প্রতিটি সদস্য সেরাটা দিতে প্রস্তুত।"\n\n## সমর্থকদের প্রত্যাশা ও টিকিটের চাহিদা\nইতিমধ্যেই অনলাইন টিকেটিং প্ল্যাটফর্মে সমর্থকদের ব্যাপক ভিড় লক্ষ্য করা গেছে। বিসিবির কর্মকর্তারা জানিয়েছেন, সাধারণ গ্যালারির অধিকাংশ টিকিট প্রথম দিনেই শেষ হয়ে গেছে।`
    );
    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
    const [isSaving, setIsSaving] = useState(false);

    // Auto-configure flags & progressive disclosure on Preset Change
    const handlePresetChange = (preset: ContentTypePreset) => {
        setContentType(preset);

        if (preset === "standard") {
            setIsBreaking(false);
            if (bylineMode === "editorial" || bylineMode === "opinion-author") {
                setBylineMode("online-desk");
            }
            if (category === "মতামত") setCategory("জাতীয়");
        } else if (preset === "breaking") {
            setIsBreaking(true);
            setIsLead(false);
            if (bylineMode === "editorial" || bylineMode === "opinion-author") {
                setBylineMode("online-desk");
            }
        } else if (preset === "opinion") {
            setIsBreaking(false);
            setIsLead(false);
            setCategory("মতামত");
            setBylineMode("opinion-author");
        } else if (preset === "editorial") {
            setIsBreaking(false);
            setIsLead(false);
            setCategory("মতামত");
            setBylineMode("editorial");
        }
    };

    // Auto-generate slug when title changes
    useEffect(() => {
        if (!isSlugManuallyEdited && title.trim()) {
            setSlug(generateCleanSlug(title));
        }
    }, [title, isSlugManuallyEdited]);

    // Live statistics
    const stats = calculateArticleStats(bodyContent, excerpt);

    // Calculate final effective author string
    const getEffectiveAuthor = (): string => {
        if (contentType === "editorial" || bylineMode === "editorial") {
            return "সম্পাদকীয়";
        }
        if (contentType === "opinion" || bylineMode === "opinion-author") {
            return opinionAuthorName.trim() || "কলামিস্ট";
        }
        if (bylineMode === "online-desk") {
            return "অনলাইন ডেস্ক";
        }
        if (bylineMode === "own-reporter") {
            return "নিজস্ব প্রতিবেদক";
        }
        if (bylineMode === "special-correspondent") {
            return "বিশেষ সংবাদদাতা";
        }
        if (bylineMode === "district-correspondent") {
            const district = districtName.trim();
            return district ? `${district} প্রতিনিধি` : "জেলা প্রতিনিধি";
        }
        if (bylineMode === "named-reporter") {
            return namedReporter.trim() || "নিজস্ব প্রতিবেদক";
        }
        return "অনলাইন ডেস্ক";
    };

    // Tag management
    const handleAddTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
        if (e && "key" in e && e.key !== "Enter" && e.key !== ",") return;
        if (e) e.preventDefault();

        const cleanTag = tagInput.trim().replace(/^#+/, "").replace(/,/g, "");
        if (cleanTag && !tags.includes(`#${cleanTag}`)) {
            setTags([...tags, `#${cleanTag}`]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((t) => t !== tagToRemove));
    };

    // Rich text toolbar operations
    const insertFormatting = (prefix: string, suffix: string = "", placeholder: string = "") => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end) || placeholder;

        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);

        const newText = `${before}${prefix}${selectedText}${suffix}${after}`;
        setBodyContent(newText);

        setTimeout(() => {
            textarea.focus();
            const cursorStart = start + prefix.length;
            const cursorEnd = cursorStart + selectedText.length;
            textarea.setSelectionRange(cursorStart, cursorEnd);
        }, 10);
    };

    const handleToolbarAction = (action: string) => {
        switch (action) {
            case "p":
                insertFormatting("\n\n", "\n\n", "নতুন অনুচ্ছেদ লিখুন...");
                break;
            case "h2":
                insertFormatting("\n\n## ", "\n", "উপ-শিরোনাম ২");
                break;
            case "h3":
                insertFormatting("\n\n### ", "\n", "উপ-শিরোনাম ৩");
                break;
            case "bold":
                insertFormatting("**", "**", "বোল্ড লেখা");
                break;
            case "italic":
                insertFormatting("*", "*", "ইটালিক লেখা");
                break;
            case "quote":
                insertFormatting('\n\n> "', '"\n\n', "এখানে একটি গুরুত্বপূর্ণ উদ্ধৃতি বা বক্তব্য লিখুন...");
                break;
            case "bullet":
                insertFormatting("\n- ", "\n- দ্বিতীয় পয়েন্ট\n- তৃতীয় পয়েন্ট\n", "প্রথম পয়েন্ট");
                break;
            default:
                break;
        }
    };

    // Editorial submission handler
    const handleWorkflowAction = (status: "draft" | "review" | "published") => {
        if (!title.trim()) {
            alert("অনুগ্রহ করে সংবাদের একটি শিরোনাম (Headline) লিখুন।");
            return;
        }

        setIsSaving(true);

        const currentCat = CATEGORIES.find((c) => c.name === category) || CATEGORIES[0];
        const finalSlug = slug.trim() || generateCleanSlug(title);
        const effectiveAuthor = getEffectiveAuthor();

        const newArticle: NewsArticleItem = {
            id: `article-${Date.now()}`,
            slug: finalSlug,
            title: title.trim(),
            subtitle: subtitle.trim() || undefined,
            excerpt: excerpt.trim() || title.trim(),
            body: bodyContent,
            category: currentCat.name,
            categorySlug: currentCat.slug,
            tags,
            isBreaking: contentType === "breaking" ? true : isBreaking,
            isLead: contentType === "opinion" || contentType === "editorial" ? false : isLead,
            imageUrl: imageUrl.trim() || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&q=80",
            imageCaption: imageCaption.trim() || undefined,
            photoCredit: photoCredit.trim() || undefined,
            author: effectiveAuthor,
            authorDesignation: contentType === "opinion" ? opinionDesignation.trim() : undefined,
            authorPhotoUrl: contentType === "opinion" ? opinionPhotoUrl.trim() : undefined,
            contentType,
            bylineType: bylineMode,
            districtName: bylineMode === "district-correspondent" ? districtName.trim() : undefined,
            publishedAt: "এইমাত্র",
            readingTimeMin: stats.readingTimeMin,
            status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        saveArticle(newArticle);

        // Redirect to /admin/articles with query param for toast
        router.push(`/admin/articles?saved=${status}&title=${encodeURIComponent(newArticle.title)}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* ─── Breadcrumb & Top Actions ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                    <nav className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                        <Link href="/admin" className="hover:text-slate-800">ড্যাশবোর্ড</Link>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <Link href="/admin/articles" className="hover:text-slate-800">সংবাদ ব্যবস্থাপনা</Link>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-800 font-semibold">নতুন সংবাদ তৈরি</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1
                            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            নিউজকাউন্টার এডিটর (Newsroom Editor)
                        </h1>
                    </div>
                </div>

                {/* Workflow Actions in Header with Lucide Icons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/admin/articles"
                        className="px-3.5 py-2 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>বাতিল</span>
                    </Link>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleWorkflowAction("draft")}
                        className="px-3.5 py-2 text-xs font-bold rounded-md border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <Save className="w-3.5 h-3.5 text-slate-600" />
                        <span>খসড়া সংরক্ষণ</span>
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleWorkflowAction("review")}
                        className="px-4 py-2 text-xs font-bold rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>পর্যালোচনার জন্য জমা</span>
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleWorkflowAction("published")}
                        className="px-5 py-2 text-xs font-bold rounded-md bg-red-700 text-white hover:bg-red-800 transition-colors shadow-sm flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>এখনই প্রকাশ করুন</span>
                    </button>
                </div>
            </div>

            {/* ─── 1. CONTENT TYPE PRESETS (TOP PILLS) ─── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <span
                            className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>সংবাদের ধরন ও প্রিসেট (Content Preset)</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                                — ফরম্যাট অনুসারে ফর্ম স্বয়ংক্রিয়ভাবে পরিবর্তিত হবে
                            </span>
                        </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                        বর্তমান বাইলাইন: <strong className="text-slate-900">{getEffectiveAuthor()}</strong>
                    </span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                    {CONTENT_TYPE_PRESETS.map((preset) => {
                        const IconComponent = preset.icon;
                        const isSelected = contentType === preset.id;
                        return (
                            <button
                                key={preset.id}
                                type="button"
                                onClick={() => handlePresetChange(preset.id)}
                                className={`p-3 rounded-lg border text-left transition-all relative flex flex-col justify-between ${
                                    isSelected
                                        ? "border-red-600 bg-red-50/60 ring-2 ring-red-600/10 shadow-xs"
                                        : "border-slate-200 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50"
                                }`}
                            >
                                <div className="flex items-center justify-between w-full mb-1">
                                    <IconComponent className={`w-5 h-5 ${isSelected ? "text-red-700" : "text-slate-500"}`} />
                                    {isSelected && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-600 text-white">
                                            সক্রিয়
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <div
                                        className={`text-xs sm:text-sm font-bold ${
                                            isSelected ? "text-red-950 font-black" : "text-slate-800"
                                        }`}
                                        style={{ fontFamily: "var(--font-headline)" }}
                                    >
                                        {preset.label}
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                                        {preset.desc}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ─── Main Content Grid (8 cols editor + 4 cols sidebar) ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ─── Left Column: Writing Canvas (8 cols) ─── */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Breaking Alert Notice */}
                    {contentType === "breaking" && (
                        <div className="p-3.5 rounded-lg bg-red-50 border border-red-300 text-red-900 flex items-center justify-between text-xs animate-fade-in shadow-2xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
                                <span className="font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                                    ব্রেকিং নিউজ মোড সক্রিয়:
                                </span>
                                <span>এই সংবাদটি প্রকাশের পর স্বয়ংক্রিয়ভাবে হোমপেজের ব্রেকিং টিকার ও লাল ব্যানারে অগ্রাধিকার পাবে।</span>
                            </div>
                        </div>
                    )}

                    {/* Editorial Institutional Notice */}
                    {contentType === "editorial" && (
                        <div className="p-3.5 rounded-lg bg-slate-900 text-white border border-slate-800 flex items-center gap-3 text-xs shadow-2xs animate-fade-in">
                            <Landmark className="w-5 h-5 text-amber-400 flex-shrink-0" />
                            <div>
                                <span className="font-bold text-sm" style={{ fontFamily: "var(--font-headline)" }}>
                                    নয়া বাংলা প্রাতিষ্ঠানিক সম্পাদকীয়
                                </span>
                                <p className="text-[11px] text-slate-300 mt-0.5">
                                    সম্পাদকীয় লেখার ক্ষেত্রে কোনো একক প্রতিবেদকের নাম ব্যবহার হয় না। বাইলাইনে অফিসিয়াল প্রাতিষ্ঠানিক স্ট্যাম্প প্রদর্শিত হবে।
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Headline & Slug Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                        <div>
                            <label
                                htmlFor="article-title"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                সংবাদের মূল শিরোনাম (Headline) <span className="text-red-600">*</span>
                            </label>
                            <input
                                id="article-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder={
                                    contentType === "editorial"
                                        ? "সম্পাদকীয় শিরোনাম: জনস্বার্থে জরুরি জাতীয় ইস্যু বা নীতিমালা..."
                                        : contentType === "opinion"
                                        ? "মতামত শিরোনাম: বিষয়ভিত্তিক বিশ্লেষণ ও পর্যবেক্ষণ..."
                                        : contentType === "breaking"
                                        ? "ব্রেকিং: দ্রুত সংক্ষিপ্ত প্রধান তথ্য লিখুন..."
                                        : "এখানে আকর্ষণীয় ও নির্ভুল শিরোনাম লিখুন..."
                                }
                                className="w-full px-4 py-3 text-lg sm:text-xl font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder:text-slate-300 placeholder:font-normal"
                                style={{ fontFamily: "var(--font-headline)" }}
                            />
                        </div>

                        {/* Clean URL Slug */}
                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-1">
                                <label
                                    htmlFor="article-slug"
                                    className="block text-[11px] font-bold text-slate-600"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    ইউআরএল স্লাগ (Permanent URL Slug)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsSlugManuallyEdited(false);
                                        setSlug(generateCleanSlug(title));
                                    }}
                                    className="text-[11px] font-semibold text-red-700 hover:underline"
                                >
                                    শিরোনাম থেকে পুনরায় তৈরি করুন
                                </button>
                            </div>
                            <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 overflow-hidden text-xs">
                                <span className="px-3 py-2 text-slate-400 font-mono select-none border-r border-slate-200 bg-slate-100">
                                    https://craftera.bd/article/
                                </span>
                                <input
                                    id="article-slug"
                                    type="text"
                                    value={slug}
                                    onChange={(e) => {
                                        setIsSlugManuallyEdited(true);
                                        setSlug(e.target.value);
                                    }}
                                    placeholder="headline-url-slug"
                                    className="flex-1 px-3 py-2 bg-transparent font-mono text-slate-800 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Sub-headline */}
                        <div>
                            <label
                                htmlFor="article-subtitle"
                                className="block text-xs font-bold text-slate-700 mb-1.5"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                উপ-শিরোনাম (Sub-headline / ঐচ্ছিক)
                            </label>
                            <input
                                id="article-subtitle"
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                placeholder="শিরোনামের সম্পূরক সংক্ষিপ্ত উপ-শিরোনাম..."
                                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Excerpt / Lead Intro */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="article-excerpt"
                                    className="block text-xs font-bold text-slate-700"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    সারসংক্ষেপ / ভূমিকা (Excerpt / Summary)
                                </label>
                                <span className="text-[11px] text-slate-400 font-mono">
                                    {toBengaliNumber(excerpt.length)} অক্ষর
                                </span>
                            </div>
                            <textarea
                                id="article-excerpt"
                                rows={2}
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="হোমপেজ ও সামাজিক মাধ্যমে প্রদর্শনের জন্য ২-৩ লাইনের সংক্ষিপ্ত সারসংক্ষেপ..."
                                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Rich Text Editor Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                        {/* Editor Header & Toolbar */}
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-700" style={{ fontFamily: "var(--font-headline)" }}>
                                    সংবাদ বিবরণ (Editorial Body)
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-bold">
                                    ডিস্ট্রাকশন-ফ্রি
                                </span>
                            </div>

                            {/* View Mode Toggle: Write vs Preview with Lucide icons */}
                            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("write")}
                                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                                        activeTab === "write"
                                            ? "bg-white text-slate-900 shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <PenLine className="w-3.5 h-3.5" />
                                    <span>লিখুন</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("preview")}
                                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                                        activeTab === "preview"
                                            ? "bg-white text-slate-900 shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>প্রিভিউ</span>
                                </button>
                            </div>
                        </div>

                        {/* Formatting Toolbar with Lucide Icons */}
                        {activeTab === "write" && (
                            <div className="px-4 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center gap-1 text-xs">
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("p")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1"
                                    title="অনুচ্ছেদ"
                                >
                                    <Pilcrow className="w-3.5 h-3.5" />
                                    <span>অনুচ্ছেদ</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("h2")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 flex items-center gap-1"
                                    title="উপ-শিরোনাম ২"
                                >
                                    <Heading2 className="w-3.5 h-3.5" />
                                    <span>H2</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("h3")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 flex items-center gap-1"
                                    title="উপ-শিরোনাম ৩"
                                >
                                    <Heading3 className="w-3.5 h-3.5" />
                                    <span>H3</span>
                                </button>
                                <span className="w-px h-5 bg-slate-200 mx-1" />
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("bold")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-900 font-bold border border-slate-200 flex items-center gap-1"
                                    title="বোল্ড"
                                >
                                    <Bold className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("italic")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-900 font-bold border border-slate-200 flex items-center gap-1"
                                    title="ইটালিক"
                                >
                                    <Italic className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("quote")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1"
                                    title="উদ্ধৃতি"
                                >
                                    <Quote className="w-3.5 h-3.5" />
                                    <span>উদ্ধৃতি</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("bullet")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1"
                                    title="বুলেট তালিকা"
                                >
                                    <List className="w-3.5 h-3.5" />
                                    <span>তালিকা</span>
                                </button>
                            </div>
                        )}

                        {/* Textarea or Preview Body */}
                        <div className="p-4 sm:p-6 min-h-[380px]">
                            {activeTab === "write" ? (
                                <textarea
                                    ref={textareaRef}
                                    value={bodyContent}
                                    onChange={(e) => setBodyContent(e.target.value)}
                                    placeholder="এখানে সংবাদের বিস্তারিত বিবরণ লিখুন..."
                                    className="w-full h-96 focus:outline-none text-slate-800 text-base leading-loose font-normal resize-y"
                                    style={{ fontFamily: "var(--font-body)" }}
                                />
                            ) : (
                                <div className="space-y-4 max-w-prose leading-relaxed text-slate-800">
                                    {bodyContent.split("\n\n").map((block, idx) => {
                                        const trimmed = block.trim();
                                        if (!trimmed) return null;
                                        if (trimmed.startsWith("### ")) {
                                            return (
                                                <h3
                                                    key={idx}
                                                    className="text-lg font-bold text-slate-900 mt-4 mb-2"
                                                    style={{ fontFamily: "var(--font-headline)" }}
                                                >
                                                    {trimmed.replace(/^###\s*/, "")}
                                                </h3>
                                            );
                                        }
                                        if (trimmed.startsWith("## ")) {
                                            return (
                                                <h2
                                                    key={idx}
                                                    className="text-xl font-extrabold text-slate-900 mt-6 mb-3 border-b pb-1"
                                                    style={{ fontFamily: "var(--font-headline)" }}
                                                >
                                                    {trimmed.replace(/^##\s*/, "")}
                                                </h2>
                                            );
                                        }
                                        if (trimmed.startsWith("> ")) {
                                            return (
                                                <blockquote
                                                    key={idx}
                                                    className="pl-4 py-2 border-l-4 border-red-600 bg-red-50/60 rounded-r text-base font-semibold text-slate-800 my-4 italic"
                                                    style={{ fontFamily: "var(--font-headline)" }}
                                                >
                                                    {trimmed.replace(/^>\s*/, "").replace(/^"|"$/g, "")}
                                                </blockquote>
                                            );
                                        }
                                        if (trimmed.startsWith("- ")) {
                                            const items = trimmed.split("\n").filter((l) => l.trim().startsWith("- "));
                                            return (
                                                <ul key={idx} className="list-disc list-inside space-y-1 text-slate-700 pl-2">
                                                    {items.map((item, itemIdx) => (
                                                        <li key={itemIdx}>{item.replace(/^-\s*/, "")}</li>
                                                    ))}
                                                </ul>
                                            );
                                        }
                                        return (
                                            <p key={idx} className="text-slate-700 text-base leading-relaxed">
                                                {trimmed}
                                            </p>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Live Article Stats Bar */}
                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-500">শব্দ সংখ্যা:</span>
                                    <span className="font-bold text-slate-900 font-mono text-sm">
                                        {stats.bengaliWordCount}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-500">অক্ষর:</span>
                                    <span className="font-bold text-slate-900 font-mono text-sm">
                                        {stats.bengaliCharCount}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-500">পড়ার সময়:</span>
                                    <span className="font-bold text-emerald-700 text-sm">
                                        {stats.bengaliReadingTime}
                                    </span>
                                </div>
                            </div>
                            <div className="text-[11px] text-slate-400">
                                স্বয়ংক্রিয় লাইভ হিসাব
                            </div>
                        </div>
                    </div>

                    {/* Direct Local Image Uploader Card (TASK 3) */}
                    <LocalImageUploader
                        imageUrl={imageUrl}
                        onImageChange={setImageUrl}
                        imageCaption={imageCaption}
                        onCaptionChange={setImageCaption}
                        photoCredit={photoCredit}
                        onCreditChange={setPhotoCredit}
                        samplePresets={SAMPLE_PRESET_IMAGES}
                    />
                </div>

                {/* ─── Right Column: Smart Byline, Flags & Workflow (4 cols) ─── */}
                <div className="lg:col-span-4 space-y-6 sticky top-20">
                    {/* ─── 2. SMART BYLINE MODE (স্মার্ট বাইলাইন) ─── */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span
                                className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                <PenLine className="w-4 h-4 text-slate-600" />
                                <span>স্মার্ট বাইলাইন (Smart Byline)</span>
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border">
                                {contentType === "editorial"
                                    ? "লকড"
                                    : contentType === "opinion"
                                    ? "লেখক প্রোফাইল"
                                    : "নিউজ ডেস্ক"}
                            </span>
                        </div>

                        {/* CASE A: EDITORIAL (Institutional Byline Locked) */}
                        {contentType === "editorial" && (
                            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-300 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Landmark className="w-5 h-5 text-slate-700" />
                                    <div>
                                        <div className="text-xs font-black text-slate-900" style={{ fontFamily: "var(--font-headline)" }}>
                                            সম্পাদকীয় (Editorial Desk)
                                        </div>
                                        <span className="text-[10px] text-slate-500">
                                            প্রাতিষ্ঠানিক বক্তব্য • কোনো একক লেখক প্রযোজ্য নয়
                                        </span>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                                    বাইলাইনে অফিসিয়াল প্রাতিষ্ঠানিক স্ট্যাম্প স্বয়ংক্রিয়ভাবে প্রদর্শিত হবে।
                                </div>
                            </div>
                        )}

                        {/* CASE B: OPINION & COLUMN (Author Name, Designation, Photo) */}
                        {contentType === "opinion" && (
                            <div className="space-y-3.5">
                                <div className="p-2.5 rounded bg-red-50 border border-red-200 text-xs text-red-900">
                                    মতামত ও কলামের জন্য লেখকের পূর্ণ বিবরণ ও ছবি প্রদান করুন:
                                </div>

                                {/* Author Name */}
                                <div>
                                    <label
                                        htmlFor="opinion-author-name"
                                        className="block text-xs font-bold text-slate-700 mb-1"
                                        style={{ fontFamily: "var(--font-headline)" }}
                                    >
                                        লেখকের নাম (Author Name) <span className="text-red-600">*</span>
                                    </label>
                                    <input
                                        id="opinion-author-name"
                                        type="text"
                                        value={opinionAuthorName}
                                        onChange={(e) => setOpinionAuthorName(e.target.value)}
                                        placeholder="উদা: প্রফেসর ড. মুস্তাক আহমেদ"
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 font-bold"
                                    />
                                </div>

                                {/* Designation */}
                                <div>
                                    <label
                                        htmlFor="opinion-designation"
                                        className="block text-xs font-bold text-slate-700 mb-1"
                                        style={{ fontFamily: "var(--font-headline)" }}
                                    >
                                        পদবি / পরিচিতি (Designation)
                                    </label>
                                    <input
                                        id="opinion-designation"
                                        type="text"
                                        value={opinionDesignation}
                                        onChange={(e) => setOpinionDesignation(e.target.value)}
                                        placeholder="উদা: কলামিস্ট ও অধ্যাপক, সমাজবিজ্ঞান বিভাগ"
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                                    />
                                </div>

                                {/* Author Photo URL */}
                                <div>
                                    <label
                                        htmlFor="opinion-photo-url"
                                        className="block text-xs font-bold text-slate-700 mb-1"
                                        style={{ fontFamily: "var(--font-headline)" }}
                                    >
                                        লেখকের ছবির ইউআরএল (Author Photo)
                                    </label>
                                    <input
                                        id="opinion-photo-url"
                                        type="text"
                                        value={opinionPhotoUrl}
                                        onChange={(e) => setOpinionPhotoUrl(e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600"
                                    />
                                </div>

                                {/* Author Quick Presets */}
                                <div className="pt-2 border-t border-slate-100">
                                    <span className="text-[10px] font-bold text-slate-500 block mb-1.5">
                                        নমুনা কলামিস্ট নির্বাচন করুন:
                                    </span>
                                    <div className="flex flex-col gap-1.5">
                                        {SAMPLE_OPINION_PHOTOS.map((col, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => {
                                                    setOpinionAuthorName(col.name);
                                                    setOpinionDesignation(col.role);
                                                    setOpinionPhotoUrl(col.url);
                                                }}
                                                className="flex items-center gap-2 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-xs"
                                            >
                                                <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 bg-slate-200">
                                                    <Image src={col.url} alt={col.name} fill className="object-cover" sizes="24px" />
                                                </div>
                                                <div className="truncate">
                                                    <span className="font-bold text-slate-800 text-[11px] block truncate">{col.name}</span>
                                                    <span className="text-[10px] text-slate-400 block truncate">{col.role}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CASE C: STANDARD & BREAKING */}
                        {contentType !== "editorial" && contentType !== "opinion" && (
                            <div className="space-y-3">
                                <div>
                                    <label
                                        htmlFor="byline-selector"
                                        className="block text-xs font-bold text-slate-700 mb-1.5"
                                        style={{ fontFamily: "var(--font-headline)" }}
                                    >
                                        বাইলাইন ধরন (Byline Type)
                                    </label>
                                    <select
                                        id="byline-selector"
                                        value={bylineMode}
                                        onChange={(e) => setBylineMode(e.target.value as BylineMode)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                                    >
                                        <option value="online-desk">অনলাইন ডেস্ক (ডিফল্ট)</option>
                                        <option value="own-reporter">নিজস্ব প্রতিবেদক</option>
                                        <option value="special-correspondent">বিশেষ সংবাদদাতা</option>
                                        <option value="district-correspondent">জেলা প্রতিনিধি (নির্দিষ্ট জেলা)</option>
                                        <option value="named-reporter">নির্দিষ্ট প্রতিবেদক (নাম উল্লেখ করুন)</option>
                                    </select>
                                    <p className="mt-1 text-[11px] text-slate-500">
                                        ডিফল্টভাবে সাধারণ সংবাদের ক্ষেত্রে কোনো একক সাংবাদিকের নাম বাধ্যতামূলক নয়।
                                    </p>
                                </div>

                                {/* Dynamic District Input */}
                                {bylineMode === "district-correspondent" && (
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 animate-fade-in">
                                        <label
                                            htmlFor="district-name"
                                            className="block text-xs font-bold text-slate-700"
                                            style={{ fontFamily: "var(--font-headline)" }}
                                        >
                                            জেলার নাম (District Name)
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                id="district-name"
                                                type="text"
                                                value={districtName}
                                                onChange={(e) => setDistrictName(e.target.value)}
                                                placeholder="যেমন: বগুড়া, সিলেট, চট্টগ্রাম..."
                                                className="flex-1 px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                                            />
                                            <span className="text-xs font-bold text-slate-600 select-none">
                                                প্রতিনিধি
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-slate-500 block">
                                            বাইলাইন প্রদর্শিত হবে: <strong>{districtName.trim() ? `${districtName.trim()} প্রতিনিধি` : "জেলা প্রতিনিধি"}</strong>
                                        </span>
                                    </div>
                                )}

                                {/* Dynamic Name Input */}
                                {bylineMode === "named-reporter" && (
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 animate-fade-in">
                                        <label
                                            htmlFor="reporter-name"
                                            className="block text-xs font-bold text-slate-700"
                                            style={{ fontFamily: "var(--font-headline)" }}
                                        >
                                            প্রতিবেদকের নাম (Reporter Name)
                                        </label>
                                        <input
                                            id="reporter-name"
                                            type="text"
                                            value={namedReporter}
                                            onChange={(e) => setNamedReporter(e.target.value)}
                                            placeholder="যেমন: তানভীর আহমেদ, নয়া বাংলা"
                                            className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Category Selection Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                        <label
                            htmlFor="category-select"
                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            বিভাগ নির্বাচন (Category)
                        </label>
                        <select
                            id="category-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 font-semibold text-slate-800"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.slug} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Flags & Badges Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
                        <span
                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            বিশেষ ফ্ল্যাগ ও প্রায়োরিটি
                        </span>

                        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={isBreaking}
                                onChange={(e) => setIsBreaking(e.target.checked)}
                                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                            />
                            <div>
                                <span className="text-xs font-bold text-slate-800 block" style={{ fontFamily: "var(--font-headline)" }}>
                                    ব্রেকিং নিউজ ট্যাগ (Breaking Ticker)
                                </span>
                                <span className="text-[10px] text-slate-500">হোমপেজের শীর্ষ লাল ব্যানারে স্ক্রল হবে</span>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={isLead}
                                onChange={(e) => setIsLead(e.target.checked)}
                                className="w-4 h-4 text-slate-900 rounded focus:ring-slate-900"
                            />
                            <div>
                                <span className="text-xs font-bold text-slate-800 block" style={{ fontFamily: "var(--font-headline)" }}>
                                    হোমপেজ প্রধান খবর (Lead Story)
                                </span>
                                <span className="text-[10px] text-slate-500">হোমপেজের প্রধান ফটো সহ সর্বাধিক দৃশ্যমান স্লট</span>
                            </div>
                        </label>
                    </div>

                    {/* Tags Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                        <label
                            htmlFor="tag-input"
                            className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            ট্যাগ ও কি-ওয়ার্ড (Tags)
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                id="tag-input"
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="ট্যাগ লিখে Enter চাপুন..."
                                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddTag()}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                            >
                                যোগ
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                    <span>{tag}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="text-slate-400 hover:text-red-600 font-bold ml-0.5"
                                        aria-label={`ট্যাগ মুছে ফেলুন: ${tag}`}
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
