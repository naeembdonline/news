import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Allow up to 10MB upload
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
]);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = (formData.get("file") || formData.get("image")) as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, error: "কোনো ফাইল পাওয়া যায়নি (No file provided)" },
                { status: 400 }
            );
        }

        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
            return NextResponse.json(
                {
                    success: false,
                    error: "অবৈধ ফরম্যাট। শুধুমাত্র JPEG, PNG, WebP, GIF বা AVIF ছবি গ্রহণযোগ্য।",
                },
                { status: 400 }
            );
        }

        // Validate File Size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                {
                    success: false,
                    error: "ছবির আকার ১০ মেগাবাইটের বেশি হতে পারবে না (File exceeds 10MB limit)",
                },
                { status: 400 }
            );
        }

        // Extract safe extension
        const rawExt = path.extname(file.name).toLowerCase() || "";
        const safeExt = rawExt && [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"].includes(rawExt)
            ? rawExt
            : ".webp";

        // Generate sanitized unique filename
        const timestamp = Date.now();
        const randomToken = Math.random().toString(36).substring(2, 9);
        const fileName = `img_${timestamp}_${randomToken}${safeExt}`;

        // Ensure target directory exists in /public/uploads/
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Convert file to buffer and write to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${fileName}`;

        return NextResponse.json({
            success: true,
            url: publicUrl,
            filename: fileName,
            size: file.size,
            mimeType: file.type,
            uploadedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("[Physical Image Upload Error]", error);
        return NextResponse.json(
            {
                success: false,
                error: "সার্ভারে ফাইল সংরক্ষণের সময় ত্রুটি ঘটেছে।",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
