// Utility functions for Bengali newsroom and article processing

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNumber(num: number | string): string {
    if (num === null || num === undefined) return "০";
    return num.toString().replace(/\d/g, (digit) => BENGALI_DIGITS[parseInt(digit, 10)] ?? digit);
}

/**
 * Generate a clean, URL-safe slug from a title.
 * Supports both Bengali and English text.
 */
export function generateCleanSlug(title: string): string {
    if (!title) return "";

    const clean = title
        .toLowerCase()
        .trim()
        // Replace punctuation, quotation marks, parentheses, question marks, and special chars
        .replace(/[।।,?!:;"'’“”‘’()[\]{}—–_#@$%^&*+=/\\|<>~`]/g, " ")
        // Replace multiple whitespace with single hyphen
        .replace(/\s+/g, "-")
        // Remove trailing or leading hyphens
        .replace(/^-+|-+$/g, "");

    return clean || `article-${Date.now().toString(36)}`;
}

/**
 * Calculate live stats for news article body
 */
export function calculateArticleStats(content: string, excerpt: string = ""): {
    wordCount: number;
    charCount: number;
    readingTimeMin: number;
    bengaliWordCount: string;
    bengaliCharCount: string;
    bengaliReadingTime: string;
} {
    const combinedText = `${content} ${excerpt}`.trim();
    if (!combinedText) {
        return {
            wordCount: 0,
            charCount: 0,
            readingTimeMin: 1,
            bengaliWordCount: "০",
            bengaliCharCount: "০",
            bengaliReadingTime: "১ মিনিট",
        };
    }

    const words = combinedText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const charCount = combinedText.length;
    // Standard Bengali reading speed: ~150 words per minute
    const readingTimeMin = Math.max(1, Math.ceil(wordCount / 150));

    return {
        wordCount,
        charCount,
        readingTimeMin,
        bengaliWordCount: toBengaliNumber(wordCount),
        bengaliCharCount: toBengaliNumber(charCount),
        bengaliReadingTime: `${toBengaliNumber(readingTimeMin)} মিনিট`,
    };
}
