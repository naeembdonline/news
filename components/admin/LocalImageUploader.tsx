"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import Image from "next/image";
import {
    UploadCloud,
    Link as LinkIcon,
    Image as ImageIcon,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    HardDrive,
} from "lucide-react";
import { toBengaliNumber } from "@/lib/bengaliUtils";

interface LocalImageUploaderProps {
    imageUrl: string;
    onImageChange: (url: string) => void;
    imageCaption: string;
    onCaptionChange: (caption: string) => void;
    photoCredit: string;
    onCreditChange: (credit: string) => void;
    samplePresets?: { url: string; caption: string; credit: string }[];
}

export default function LocalImageUploader({
    imageUrl,
    onImageChange,
    imageCaption,
    onCaptionChange,
    photoCredit,
    onCreditChange,
    samplePresets = [],
}: LocalImageUploaderProps) {
    const [mode, setMode] = useState<"local" | "url" | "presets">("local");
    const [isDragging, setIsDragging] = useState(false);
    const [fileName, setFileName] = useState<string>("");
    const [fileSize, setFileSize] = useState<string>("");
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadSuccessServer, setUploadSuccessServer] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileProcess = async (file: File) => {
        setUploadError(null);
        setUploadSuccessServer(false);

        // Validate type
        if (!file.type.startsWith("image/")) {
            setUploadError("শুধুমাত্র ছবি ফাইল (JPEG, PNG, WebP, GIF, AVIF) আপলোড করা যাবে।");
            return;
        }

        // Validate size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setUploadError("ছবির আকার ১০ মেগাবাইটের বেশি হতে পারবে না।");
            return;
        }

        const sizeFormatted = file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;

        setFileName(file.name);
        setFileSize(sizeFormatted);
        setIsUploading(true);

        // 1. Attempt Physical Server Upload to /api/upload
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                if (data.success && data.url) {
                    onImageChange(data.url);
                    setUploadSuccessServer(true);
                    setIsUploading(false);
                    return;
                }
            }
            throw new Error("Server upload endpoint returned non-success");
        } catch (serverErr) {
            console.warn("[Upload API Notice - Using Local Data URL Fallback]", serverErr);

            // 2. Fallback to Local Data URL
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    onImageChange(e.target.result as string);
                    setIsUploading(false);
                }
            };
            reader.onerror = () => {
                setUploadError("ফাইল প্রসেস করতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
                setIsUploading(false);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileProcess(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFileProcess(e.target.files[0]);
        }
    };

    const handleRemoveImage = () => {
        onImageChange("");
        setFileName("");
        setFileSize("");
        setUploadError(null);
        setUploadSuccessServer(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-red-600" />
                    <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-headline)" }}>
                        ফিচার্ড ছবি ও সার্ভার আপলোড (Hero Image Pipeline)
                    </h2>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold" style={{ fontFamily: "var(--font-headline)" }}>
                    <button
                        type="button"
                        onClick={() => setMode("local")}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                            mode === "local" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <UploadCloud className="w-3.5 h-3.5" />
                        <span>সার্ভার আপলোড</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("url")}
                        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                            mode === "url" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>ওয়েব লিঙ্ক</span>
                    </button>
                    {samplePresets.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setMode("presets")}
                            className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${
                                mode === "presets" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>নমুনা ছবি</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Error Message */}
            {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{uploadError}</span>
                </div>
            )}

            {/* Mode A: Local File Upload with /api/upload integration */}
            {mode === "local" && (
                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                        className="hidden"
                        onChange={handleFileInput}
                    />

                    <div
                        onClick={() => !isUploading && fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                            isDragging
                                ? "border-red-600 bg-red-50/70"
                                : isUploading
                                ? "border-amber-400 bg-amber-50/40 cursor-wait"
                                : "border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50"
                        }`}
                    >
                        {isUploading ? (
                            <div className="py-2">
                                <Loader2 className="w-8 h-8 text-red-600 animate-spin mx-auto mb-2" />
                                <div className="text-sm font-bold text-slate-800" style={{ fontFamily: "var(--font-headline)" }}>
                                    সার্ভারে ফাইল আপলোড হচ্ছে... (/public/uploads/)
                                </div>
                                <p className="text-xs text-slate-500 mt-1">অনুগ্রহ করে কয়েক মুহূর্ত অপেক্ষা করুন</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto mb-3">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <div className="text-sm font-bold text-slate-800 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                                    কম্পিউটার বা ডিভাইস থেকে ছবি নির্বাচন করুন
                                </div>
                                <p className="text-xs text-slate-500 mb-2">
                                    ফাইল এখানে টেনে আনুন (Drag & Drop) অথবা ব্রাউজ করতে ক্লিক করুন
                                </p>
                                <div className="text-[11px] text-slate-400">
                                    স্বয়ংক্রিয়ভাবে সার্ভারের <code>/public/uploads/</code> এ সংরক্ষিত হবে • সর্বোচ্চ: ১০ MB
                                </div>
                            </>
                        )}
                    </div>

                    {fileName && !isUploading && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <span className="font-semibold text-emerald-900 truncate max-w-xs block">{fileName}</span>
                                    <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-mono mt-0.5">
                                        <span>আকার: {fileSize}</span>
                                        {uploadSuccessServer && (
                                            <span className="flex items-center gap-1 font-bold text-emerald-800">
                                                <HardDrive className="w-3 h-3" />
                                                <span>সার্ভারে সংরক্ষিত (/uploads)</span>
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveImage();
                                }}
                                className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>মুছুন</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Mode B: Direct Web URL */}
            {mode === "url" && (
                <div>
                    <label
                        htmlFor="hero-image-url-input"
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        ছবির অনলাইন লিঙ্ক (Image URL)
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="hero-image-url-input"
                            type="text"
                            value={imageUrl}
                            onChange={(e) => {
                                onImageChange(e.target.value);
                                setFileName("");
                                setFileSize("");
                                setUploadSuccessServer(false);
                            }}
                            placeholder="https://... অথবা /uploads/image.webp"
                            className="flex-1 px-3.5 py-2 text-xs font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        {imageUrl && (
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="মুছে ফেলুন"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Mode C: Sample Presets */}
            {mode === "presets" && samplePresets.length > 0 && (
                <div>
                    <span className="block text-[11px] font-bold text-slate-500 mb-2">
                        দ্রুত ব্যবহারের জন্য নমুনা ছবি নির্বাচন করুন:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {samplePresets.map((preset, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                    onImageChange(preset.url);
                                    onCaptionChange(preset.caption);
                                    onCreditChange(preset.credit);
                                    setFileName(`নমুনা ছবি ${idx + 1}`);
                                    setFileSize("");
                                    setUploadSuccessServer(false);
                                }}
                                className={`flex items-center gap-2.5 p-2 rounded-lg border text-left text-xs transition-all ${
                                    imageUrl === preset.url
                                        ? "border-red-600 bg-red-50/50 ring-1 ring-red-600"
                                        : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                                }`}
                            >
                                <div className="relative w-12 h-10 rounded overflow-hidden flex-shrink-0 bg-slate-200">
                                    <Image
                                        src={preset.url}
                                        alt="নমুনা"
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                        unoptimized
                                    />
                                </div>
                                <div className="truncate flex-1">
                                    <div className="font-semibold text-slate-800 truncate">
                                        ছবি {toBengaliNumber(idx + 1)}
                                    </div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                        {preset.credit}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Caption & Credit Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                    <label
                        htmlFor="image-caption-input"
                        className="block text-xs font-bold text-slate-700 mb-1"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        ছবির ক্যাপশন (Image Caption)
                    </label>
                    <input
                        id="image-caption-input"
                        type="text"
                        value={imageCaption}
                        onChange={(e) => onCaptionChange(e.target.value)}
                        placeholder="ছবির বর্ণনা বা পটভূমি..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>
                <div>
                    <label
                        htmlFor="photo-credit-input"
                        className="block text-xs font-bold text-slate-700 mb-1"
                        style={{ fontFamily: "var(--font-headline)" }}
                    >
                        ফটোগ্রাফার / সোর্স (Photo Credit)
                    </label>
                    <input
                        id="photo-credit-input"
                        type="text"
                        value={photoCredit}
                        onChange={(e) => onCreditChange(e.target.value)}
                        placeholder="ছবি: নয়া বাংলা ডেস্ক / শামসুল হক"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                </div>
            </div>

            {/* Live Image Preview */}
            {imageUrl && (
                <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-2">
                        <div className="flex items-center gap-1.5">
                            <span>লাইভ ইমেজ প্রিভিউ:</span>
                            {imageUrl.startsWith("/uploads/") && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono">
                                    হোস্টেড লোকাল ফাইল
                                </span>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ছবি বাদ দিন</span>
                        </button>
                    </div>
                    <div className="relative w-full h-52 sm:h-64 rounded-lg overflow-hidden bg-slate-200 shadow-inner">
                        <Image
                            src={imageUrl}
                            alt={imageCaption || "ফিচার্ড ছবি"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            unoptimized
                        />
                    </div>
                    {imageCaption && (
                        <p className="mt-2 text-xs text-slate-600 italic">
                            {imageCaption} {photoCredit ? `— ${photoCredit}` : ""}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
