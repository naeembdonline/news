"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
    Loader2,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mockData";
import { generateCleanSlug, calculateArticleStats, toBengaliNumber } from "@/lib/bengaliUtils";
import { getArticleById, saveArticle, NewsArticleItem } from "@/lib/articleStorage";
import LocalImageUploader from "@/components/admin/LocalImageUploader";

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

export default function EditArticlePage() {
    const router = useRouter();
    const params = useParams();
    const articleId = params?.id as string;

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);

    // Form states
    const [contentType, setContentType] = useState<ContentTypePreset>("standard");
    const [bylineMode, setBylineMode] = useState<BylineMode>("online-desk");
    const [districtName, setDistrictName] = useState("");
    const [namedReporter, setNamedReporter] = useState("");
    const [opinionAuthorName, setOpinionAuthorName] = useState("");
    const [opinionDesignation, setOpinionDesignation] = useState("");
    const [opinionPhotoUrl, setOpinionPhotoUrl] = useState("");

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [category, setCategory] = useState("জাতীয়");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [isBreaking, setIsBreaking] = useState(false);
    const [isLead, setIsLead] = useState(false);

    const [imageUrl, setImageUrl] = useState("");
    const [imageCaption, setImageCaption] = useState("");
    const [photoCredit, setPhotoCredit] = useState("");
    const [bodyContent, setBodyContent] = useState("");
    const [createdAt, setCreatedAt] = useState("");

    const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
    const [isSaving, setIsSaving] = useState(false);

    // Load article data on client mount
    useEffect(() => {
        if (!articleId) return;

        const loaded = getArticleById(articleId);
        if (!loaded) {
            setNotFoundError(true);
            setIsLoading(false);
            return;
        }

        setTitle(loaded.title || "");
        setSlug(loaded.slug || "");
        setSubtitle(loaded.subtitle || "");
        setExcerpt(loaded.excerpt || "");
        setBodyContent(loaded.body || "");
        setCategory(loaded.category || "জাতীয়");
        setTags(loaded.tags || ["#সংবাদ"]);
        setIsBreaking(loaded.isBreaking || false);
        setIsLead(loaded.isLead || false);
        setImageUrl(loaded.imageUrl || "");
        setImageCaption(loaded.imageCaption || "");
        setPhotoCredit(loaded.photoCredit || "");
        setContentType((loaded.contentType as ContentTypePreset) || "standard");
        setBylineMode((loaded.bylineType as BylineMode) || "online-desk");
        setDistrictName(loaded.districtName || "");
        setNamedReporter(loaded.author || "");
        setOpinionAuthorName(loaded.author || "");
        setOpinionDesignation(loaded.authorDesignation || "");
        setOpinionPhotoUrl(loaded.authorPhotoUrl || "");
        setCreatedAt(loaded.createdAt || new Date().toISOString());
        setIsLoading(false);
    }, [articleId]);

    const stats = calculateArticleStats(bodyContent, excerpt);

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

    const handleSave = (targetStatus: "draft" | "review" | "published") => {
        if (!title.trim()) {
            alert("অনুগ্রহ করে সংবাদের একটি শিরোনাম লিখুন।");
            return;
        }

        setIsSaving(true);
        const currentCat = CATEGORIES.find((c) => c.name === category) || CATEGORIES[0];
        const effectiveAuthor = getEffectiveAuthor();

        const updatedArticle: NewsArticleItem = {
            id: articleId,
            slug: slug.trim() || generateCleanSlug(title),
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
            publishedAt: targetStatus === "published" ? "হালনাগাদ" : "খসড়া",
            readingTimeMin: stats.readingTimeMin,
            status: targetStatus,
            createdAt: createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        saveArticle(updatedArticle);
        router.push(`/admin/articles?saved=updated&title=${encodeURIComponent(updatedArticle.title)}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-red-700" />
                <span className="text-sm font-semibold text-slate-600">সংবাদের তথ্য লোড হচ্ছে...</span>
            </div>
        );
    }

    if (notFoundError) {
        return (
            <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-amber-600 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "var(--font-headline)" }}>
                    সংবাদটি পাওয়া যায়নি
                </h2>
                <p className="text-sm text-slate-600">
                    আইডি &quot;{articleId}&quot; এর কোনো সংবাদ সিস্টেমে সংরক্ষিত নেই অথবা মুছে ফেলা হয়েছে।
                </p>
                <Link
                    href="/admin/articles"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>সংবাদ তালিকায় ফিরে যান</span>
                </Link>
            </div>
        );
    }

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
                        <span className="text-slate-800 font-semibold">সংবাদ সম্পাদনা</span>
                    </nav>
                    <div className="flex items-center gap-3">
                        <h1
                            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            সংবাদ সম্পাদনা (Edit Article)
                        </h1>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                            ID: {articleId}
                        </span>
                    </div>
                </div>

                {/* Workflow Actions with Lucide Icons */}
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href="/admin/articles"
                        className="px-3.5 py-2 text-xs font-semibold rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>ফিরে যান</span>
                    </Link>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSave("draft")}
                        className="px-3.5 py-2 text-xs font-bold rounded-md border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <Save className="w-3.5 h-3.5 text-slate-600" />
                        <span>খসড়া রাখুন</span>
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSave("review")}
                        className="px-4 py-2 text-xs font-bold rounded-md bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>পর্যালোচনায় জমা</span>
                    </button>
                    <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSave("published")}
                        className="px-5 py-2 text-xs font-bold rounded-md bg-red-700 text-white hover:bg-red-800 transition-colors shadow-sm flex items-center gap-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        <Send className="w-3.5 h-3.5" />
                        <span>হালনাগাদ প্রকাশ করুন</span>
                    </button>
                </div>
            </div>

            {/* ─── 1. Content Type Presets ─── */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <span
                            className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5"
                            style={{ fontFamily: "var(--font-headline)" }}
                        >
                            <Sparkles className="w-4 h-4 text-amber-600" />
                            <span>সংবাদের ধরন ও প্রিসেট</span>
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

            {/* ─── Main Content Grid ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ─── Left Column (8 cols) ─── */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Headline Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                        <div>
                            <label
                                htmlFor="edit-title"
                                className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                সংবাদের মূল শিরোনাম (Headline) <span className="text-red-600">*</span>
                            </label>
                            <input
                                id="edit-title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 text-lg sm:text-xl font-bold rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                                style={{ fontFamily: "var(--font-headline)" }}
                            />
                        </div>

                        {/* URL Slug */}
                        <div className="pt-2 border-t border-slate-100">
                            <div className="flex items-center justify-between mb-1">
                                <label
                                    htmlFor="edit-slug"
                                    className="block text-[11px] font-bold text-slate-600"
                                    style={{ fontFamily: "var(--font-headline)" }}
                                >
                                    ইউআরএল স্লাগ (Permanent URL Slug)
                                </label>
                                <button
                                    type="button"
                                    onClick={() => {
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
                                    id="edit-slug"
                                    type="text"
                                    value={slug}
                                    onChange={(e) => {
                                        setSlug(e.target.value);
                                    }}
                                    className="flex-1 px-3 py-2 bg-transparent font-mono text-slate-800 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Subtitle */}
                        <div>
                            <label
                                htmlFor="edit-subtitle"
                                className="block text-xs font-bold text-slate-700 mb-1.5"
                                style={{ fontFamily: "var(--font-headline)" }}
                            >
                                উপ-শিরোনাম (Sub-headline / ঐচ্ছিক)
                            </label>
                            <input
                                id="edit-subtitle"
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                            />
                        </div>

                        {/* Excerpt */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="edit-excerpt"
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
                                id="edit-excerpt"
                                rows={2}
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed"
                            />
                        </div>
                    </div>

                    {/* Rich Text Editor */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700" style={{ fontFamily: "var(--font-headline)" }}>
                                সংবাদ বিবরণ (Editorial Body)
                            </span>
                            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("write")}
                                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                                        activeTab === "write" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <PenLine className="w-3.5 h-3.5" />
                                    <span>লিখুন</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("preview")}
                                    className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                                        activeTab === "preview" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>প্রিভিউ</span>
                                </button>
                            </div>
                        </div>

                        {activeTab === "write" && (
                            <div className="px-4 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center gap-1 text-xs">
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("p")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 font-bold border border-slate-200 flex items-center gap-1"
                                >
                                    <Pilcrow className="w-3.5 h-3.5" />
                                    <span>অনুচ্ছেদ</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("h2")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 flex items-center gap-1"
                                >
                                    <Heading2 className="w-3.5 h-3.5" />
                                    <span>H2</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("h3")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 flex items-center gap-1"
                                >
                                    <Heading3 className="w-3.5 h-3.5" />
                                    <span>H3</span>
                                </button>
                                <span className="w-px h-5 bg-slate-200 mx-1" />
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("bold")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-900 font-bold border border-slate-200 flex items-center gap-1"
                                >
                                    <Bold className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("italic")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-900 font-bold border border-slate-200 flex items-center gap-1"
                                >
                                    <Italic className="w-3.5 h-3.5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("quote")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1"
                                >
                                    <Quote className="w-3.5 h-3.5" />
                                    <span>উদ্ধৃতি</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToolbarAction("bullet")}
                                    className="px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 flex items-center gap-1"
                                >
                                    <List className="w-3.5 h-3.5" />
                                    <span>তালিকা</span>
                                </button>
                            </div>
                        )}

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
                                                <h3 key={idx} className="text-lg font-bold text-slate-900 mt-4 mb-2" style={{ fontFamily: "var(--font-headline)" }}>
                                                    {trimmed.replace(/^###\s*/, "")}
                                                </h3>
                                            );
                                        }
                                        if (trimmed.startsWith("## ")) {
                                            return (
                                                <h2 key={idx} className="text-xl font-extrabold text-slate-900 mt-6 mb-3 border-b pb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                                    {trimmed.replace(/^##\s*/, "")}
                                                </h2>
                                            );
                                        }
                                        if (trimmed.startsWith("> ")) {
                                            return (
                                                <blockquote key={idx} className="pl-4 py-2 border-l-4 border-red-600 bg-red-50/60 rounded-r text-base font-semibold text-slate-800 my-4 italic">
                                                    {trimmed.replace(/^>\s*/, "").replace(/^"|"$/g, "")}
                                                </blockquote>
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

                        {/* Live Stats */}
                        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-500">শব্দ সংখ্যা:</span>
                                    <span className="font-bold text-slate-900 font-mono text-sm">{stats.bengaliWordCount}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-500">অক্ষর:</span>
                                    <span className="font-bold text-slate-900 font-mono text-sm">{stats.bengaliCharCount}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-slate-500">পড়ার সময়:</span>
                                    <span className="font-bold text-emerald-700 text-sm">{stats.bengaliReadingTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Direct Local Image Uploader Card */}
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

                {/* ─── Right Column (4 cols) ─── */}
                <div className="lg:col-span-4 space-y-6 sticky top-20">
                    {/* Byline Card */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5" style={{ fontFamily: "var(--font-headline)" }}>
                                <PenLine className="w-4 h-4 text-slate-600" />
                                <span>স্মার্ট বাইলাইন</span>
                            </span>
                        </div>

                        {contentType !== "editorial" && contentType !== "opinion" && (
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="byline-selector" className="block text-xs font-bold text-slate-700 mb-1.5">
                                        বাইলাইন ধরন
                                    </label>
                                    <select
                                        id="byline-selector"
                                        value={bylineMode}
                                        onChange={(e) => setBylineMode(e.target.value as BylineMode)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                                    >
                                        <option value="online-desk">অনলাইন ডেস্ক</option>
                                        <option value="own-reporter">নিজস্ব প্রতিবেদক</option>
                                        <option value="special-correspondent">বিশেষ সংবাদদাতা</option>
                                        <option value="district-correspondent">জেলা প্রতিনিধি</option>
                                        <option value="named-reporter">নির্দিষ্ট প্রতিবেদক</option>
                                    </select>
                                </div>
                                {bylineMode === "district-correspondent" && (
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                                        <label htmlFor="district-name" className="block text-xs font-bold text-slate-700">জেলার নাম</label>
                                        <input
                                            id="district-name"
                                            type="text"
                                            value={districtName}
                                            onChange={(e) => setDistrictName(e.target.value)}
                                            placeholder="যেমন: বগুড়া, সিলেট..."
                                            className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300"
                                        />
                                    </div>
                                )}
                                {bylineMode === "named-reporter" && (
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                                        <label htmlFor="reporter-name" className="block text-xs font-bold text-slate-700">প্রতিবেদকের নাম</label>
                                        <input
                                            id="reporter-name"
                                            type="text"
                                            value={namedReporter}
                                            onChange={(e) => setNamedReporter(e.target.value)}
                                            placeholder="প্রতিবেদকের পুরো নাম..."
                                            className="w-full px-3 py-1.5 text-xs rounded-md border border-slate-300"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {contentType === "opinion" && (
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="op-name" className="block text-xs font-bold text-slate-700 mb-1">লেখকের নাম</label>
                                    <input
                                        id="op-name"
                                        type="text"
                                        value={opinionAuthorName}
                                        onChange={(e) => setOpinionAuthorName(e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="op-desig" className="block text-xs font-bold text-slate-700 mb-1">পদবি / পরিচিতি</label>
                                    <input
                                        id="op-desig"
                                        type="text"
                                        value={opinionDesignation}
                                        onChange={(e) => setOpinionDesignation(e.target.value)}
                                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category Selection */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                        <label htmlFor="edit-category" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            বিভাগ নির্বাচন
                        </label>
                        <select
                            id="edit-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white font-semibold text-slate-800"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.slug} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Flags */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3.5">
                        <span className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                            বিশেষ ফ্ল্যাগ
                        </span>
                        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isBreaking}
                                onChange={(e) => setIsBreaking(e.target.checked)}
                                className="w-4 h-4 text-red-600 rounded"
                            />
                            <span className="text-xs font-bold text-slate-800">ব্রেকিং নিউজ</span>
                        </label>
                        <label className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isLead}
                                onChange={(e) => setIsLead(e.target.checked)}
                                className="w-4 h-4 text-slate-900 rounded"
                            />
                            <span className="text-xs font-bold text-slate-800">হোমপেজ প্রধান খবর</span>
                        </label>
                    </div>

                    {/* Tags */}
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                        <label htmlFor="edit-tag-input" className="block text-xs font-bold uppercase tracking-wider text-slate-700">ট্যাগ</label>
                        <div className="flex items-center gap-2">
                            <input
                                id="edit-tag-input"
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="ট্যাগ লিখে Enter চাপুন..."
                                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddTag()}
                                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white"
                            >
                                যোগ
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {tags.map((tag) => (
                                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border">
                                    <span>{tag}</span>
                                    <button type="button" onClick={() => handleRemoveTag(tag)} className="text-slate-400 hover:text-red-600 ml-0.5">×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
