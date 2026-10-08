export interface Article {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    body: string[];
    category: string;
    categorySlug: string;
    author: string;
    authorDesignation?: string;
    authorPhotoUrl?: string;
    contentType?: "standard" | "breaking" | "opinion" | "editorial";
    bylineType?: "online-desk" | "own-reporter" | "special-correspondent" | "district-correspondent" | "named-reporter" | "opinion-author" | "editorial";
    districtName?: string;
    publishedAt: string;
    imageUrl: string;
    imageAlt: string;
    pullQuote?: string;
    editorialCorrection?: string;
    isBraking?: boolean;
    readingTimeMin?: number;
}

export interface CategoryInfo {
    slug: string;
    name: string;
    description: string;
}

export const CATEGORIES: CategoryInfo[] = [
    {
        slug: "national",
        name: "জাতীয়",
        description: "দেশের সামগ্রিক পরিস্থিতি, সরকার, নীতি ও জাতীয় গুরুত্বপূর্ণ ঘটনাবলীর তথ্য",
    },
    {
        slug: "politics",
        name: "রাজনীতি",
        description: "সংসদীয় বিতর্ক, নির্বাচন, রাজনৈতিক দল ও সাম্প্রতিক রাজনৈতিক বিশ্লেষণ",
    },
    {
        slug: "economy",
        name: "অর্থনীতি",
        description: "মুদ্রাস্ফীতি, পুঁজিবাজার, রেমিট্যান্স, বিনিয়োগ ও জাতীয় অর্থনৈতিক সমীক্ষা",
    },
    {
        slug: "international",
        name: "আন্তর্জাতিক",
        description: "বিশ্ব কূটনীতি, বৈশ্বিক রাজনীতি, যুদ্ধ ও আন্তর্জাতিক সম্প্রদায়ের হালনাগাদ খবর",
    },
    {
        slug: "sports",
        name: "খেলাধুলা",
        description: "ক্রিকেট, ফুটবল ও আন্তর্জাতিক ক্রীড়াঙ্গনের লাইভ আপডেট ও ম্যাচ রিপোর্ট",
    },
    {
        slug: "tech",
        name: "প্রযুক্তি",
        description: "কৃত্রিম বুদ্ধিমত্তা, উদ্ভাবন, সাইবার নিরাপত্তা ও আধুনিক প্রযুক্তির বিকাশ",
    },
    {
        slug: "entertainment",
        name: "বিনোদন",
        description: "চলচ্চিত্র, নাট্যমঞ্চ, ওটিটি প্ল্যাটফর্ম, সঙ্গীত ও শোবিজ জগতের তারকারা",
    },
    {
        slug: "opinion",
        name: "মতামত",
        description: "বিশিষ্ট চিন্তাবিদ ও বিশেষজ্ঞদের মতামত, বিশ্লেষণ ও মুক্ত কলাম",
    },
];

export const breakingNews: string[] = [
    "ঢাকায় ৭.২ মাত্রার ভূমিকম্প অনুভূত, বেশ কয়েকটি ভবনে ফাটল",
    "সংসদে ডিজিটাল নিরাপত্তা আইন সংশোধন বিল পাস",
    "বাংলাদেশ ক্রিকেট দল পাকিস্তানকে ৫ উইকেটে হারিয়েছে",
    "রাজধানীতে যানজট নিরসনে নতুন মেট্রো রুট ঘোষণা",
    "দেশে পেঁয়াজের দাম কেজিতে ২০ টাকা বৃদ্ধি পেয়েছে",
];

export const leadStory: Article = {
    id: "1",
    slug: "dhaka-flood-national-crisis",
    title: "রাজধানীর নিম্নাঞ্চলে ভয়াবহ বন্যা: ২০ লক্ষ মানুষ পানিবন্দি",
    subtitle: "সরকার জরুরি ত্রাণ বিতরণ শুরু করেছে, সেনাবাহিনী মাঠে নামছে",
    excerpt:
        "টানা তিন দিনের অতিবৃষ্টিতে ঢাকার বেশ কয়েকটি নিম্নাঞ্চল পানিতে তলিয়ে গেছে। ত্রাণ মন্ত্রণালয় জরুরি পরিস্থিতি ঘোষণা করে সেনাবাহিনীকে উদ্ধার অভিযানে নামানোর নির্দেশ দিয়েছে।",
    body: [
        "টানা তিন দিনের অতিবৃষ্টিতে ঢাকার দক্ষিণ ও পূর্বাঞ্চলের বেশ কয়েকটি এলাকা পানিতে তলিয়ে গেছে। রাজধানীর ডেমরা, যাত্রাবাড়ী, মাতুয়াইল ও মান্ডা এলাকায় পানির স্তর বিপজ্জনক মাত্রায় পৌঁছেছে। মঙ্গলবার রাত থেকে বুধবার সকালের মধ্যে নতুন করে ২০০ মিলিমিটারেরও বেশি বৃষ্টিপাত রেকর্ড করা হয়েছে।",
        "দুর্যোগ ব্যবস্থাপনা মন্ত্রণালয়ের সচিব মোহাম্মদ শামসুদ্দিন জানিয়েছেন, ক্ষতিগ্রস্ত অঞ্চলে ত্রাণ কার্যক্রম পরিচালনার জন্য তিনটি বিশেষ টাস্কফোর্স গঠন করা হয়েছে। প্রতিটি টাস্কফোর্সে সেনাবাহিনী, বিডিআর এবং ফায়ার সার্ভিসের সদস্য রয়েছেন।",
        "স্থানীয় বাসিন্দা আরিফুল ইসলাম বলেন, 'রাত থেকেই বাড়িতে পানি উঠতে শুরু করেছে। এখন হাঁটু পর্যন্ত পানি। বাচ্চাদের নিয়ে কোথায় যাব বুঝতে পারছি না।' পাঁচ সন্তানের জনক এই ব্যক্তি তার পরিবারকে উঁচু স্থানে সরিয়ে নেওয়ার চেষ্টা করছিলেন।",
        "বাংলাদেশ আবহাওয়া অধিদপ্তর জানিয়েছে, আগামী ৪৮ ঘণ্টা মৌসুমি বায়ুর প্রভাবে দেশের বিভিন্ন অঞ্চলে ভারী থেকে অতিভারী বৃষ্টিপাতের সম্ভাবনা রয়েছে। বিশেষত চট্টগ্রাম, সিলেট এবং ময়মনসিংহ বিভাগে ভূমিধস ও বন্যার ঝুঁকি অত্যন্ত বেশি।",
        "২০ লক্ষেরও বেশি মানুষ সরাসরি ক্ষতিগ্রস্ত হয়েছেন বলে প্রাথমিক হিসাবে উঠে এসেছে। সরকারি গুদামগুলো থেকে জরুরি ভিত্তিতে চাল, ডাল, লবণ ও পানি বিশুদ্ধকরণ ট্যাবলেট বিতরণ শুরু হয়েছে।",
        "জাতীয় দুর্যোগ পূর্বাভাস ও সতর্কীকরণ কেন্দ্র (SPARRSO) জানিয়েছে, উপগ্রহ চিত্র বিশ্লেষণে দেখা গেছে পরিস্থিতি আরো অবনতির দিকে যাচ্ছে। দেশের উত্তর-পূর্বাঞ্চলে ১৪টি নদীর পানি বিপৎসীমা অতিক্রম করেছে।",
    ],
    pullQuote:
        "২০ লক্ষেরও বেশি মানুষ সরাসরি ক্ষতিগ্রস্ত। সেনাবাহিনীর উদ্ধার অভিযান পুরোদমে চলছে।",
    editorialCorrection:
        "সম্পাদকীয় সংশোধন: এই প্রতিবেদনের পূর্ববর্তী সংস্করণে ক্ষতিগ্রস্ত মানুষের সংখ্যা ১৫ লক্ষ বলা হয়েছিল। সঠিক সংখ্যা ২০ লক্ষ, যা স্থানীয় প্রশাসনের হালনাগাদ তথ্যের ভিত্তিতে সংশোধন করা হলো।",
    category: "জাতীয়",
    categorySlug: "national",
    author: "মোহাম্মদ আলী ফারুকী",
    publishedAt: "২০২৬ অক্টোবর ৬",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=1200&q=80",
    imageAlt: "বন্যাক্রান্ত এলাকায় উদ্ধারকর্মীরা",
    isBraking: true,
    readingTimeMin: 6,
};

export const subLeads: Article[] = [
    {
        id: "2",
        slug: "digital-security-amendment",
        title: "ডিজিটাল নিরাপত্তা আইন সংশোধন: সংসদে উত্তপ্ত বিতর্ক",
        excerpt:
            "বিরোধী দলগুলো সংশোধনীকে 'অপর্যাপ্ত' বলে প্রত্যাখ্যান করেছে। সরকারপক্ষ বলছে এটি যুগান্তকারী পরিবর্তন।",
        body: [],
        category: "রাজনীতি",
        categorySlug: "politics",
        author: "নাসরীন আক্তার",
        publishedAt: "২০২৬ অক্টোবর ৬",
        imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80",
        imageAlt: "জাতীয় সংসদ ভবন",
        readingTimeMin: 4,
    },
    {
        id: "3",
        slug: "bangladesh-pakistan-cricket",
        title: "বাংলাদেশ-পাকিস্তান টি-টোয়েন্টি: রোমাঞ্চকর জয়ে বাংলাদেশ শীর্ষে",
        excerpt:
            "শেষ ওভারে মুস্তাফিজুর রহমানের দুর্দান্ত বোলিংয়ে পাকিস্তানকে ৫ উইকেটে হারিয়েছে টাইগাররা।",
        body: [
            "মিরপুর শেরেবাংলা জাতীয় স্টেডিয়ামে টানটান উত্তেজনার ম্যাচে পাকিস্তানকে ৫ উইকেটে হারিয়েছে বাংলাদেশ ক্রিকেট দল। শেষ ওভারে জয়ের জন্য পাকিস্তানের প্রয়োজন ছিল মাত্র ১২ রান।",
            "মুস্তাফিজুর রহমানের প্রথম তিন বলে ব্যাটাররা কোনো বাউন্ডারি মারতে পারেননি। পঞ্চম বলে উইকেট শিকার করে মুস্তাফিজ টাইগারদের ঐতিহাসিক জয় নিশ্চিত করেন।",
            "ম্যান অব দ্য ম্যাচ নির্বাচিত হয়েছেন অলরাউন্ডার সাকিব আল হাসান, যিনি ব্যাট হাতে ৪৪ রান ও বল হাতে ৩ উইকেট শিকার করেন।",
        ],
        category: "খেলাধুলা",
        categorySlug: "sports",
        author: "রাহুল দে",
        publishedAt: "২০২৬ অক্টোবর ৬",
        imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80",
        imageAlt: "ক্রিকেট বল ও উইকেট",
        readingTimeMin: 3,
    },
    {
        id: "4",
        slug: "economy-remittance-record",
        title: "রেমিট্যান্স প্রবাহে নতুন রেকর্ড: একমাসে ২.৫ বিলিয়ন ডলার",
        excerpt:
            "প্রবাসী বাংলাদেশিদের পাঠানো অর্থ চলতি অর্থবছরে নতুন উচ্চতায় পৌঁছেছে, বিশেষজ্ঞরা বলছেন এটি টাকার বিনিময় হার স্থিতিশীল রাখতে সাহায্য করবে।",
        body: [],
        category: "অর্থনীতি",
        categorySlug: "economy",
        author: "শাহানা বেগম",
        publishedAt: "২০২৬ অক্টোবর ৫",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
        imageAlt: "বাংলাদেশ ব্যাংকের গ্রাফ",
        readingTimeMin: 5,
    },
];

export const categoryNews: Record<string, Article[]> = {
    বিজ্ঞান_প্রযুক্তি: [
        {
            id: "5",
            slug: "ai-healthcare-bangladesh",
            title: "AI দিয়ে ক্যান্সার শনাক্ত: দেশে প্রথম সফল পরীক্ষা",
            excerpt: "বঙ্গবন্ধু শেখ মুজিবুর রহমান মেডিকেল বিশ্ববিদ্যালয়ের গবেষকরা কৃত্রিম বুদ্ধিমত্তা ব্যবহার করে ৯৭% নির্ভুলতায় ক্যান্সার শনাক্ত করতে সফল হয়েছেন।",
            body: [],
            category: "বিজ্ঞান ও প্রযুক্তি",
            categorySlug: "tech",
            author: "ড. ফারহান হোসাইন",
            publishedAt: "২০২৬ অক্টোবর ৬",
            imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=500&q=80",
            imageAlt: "AI স্বাস্থ্যসেবা",
            readingTimeMin: 5,
        },
        {
            id: "6",
            slug: "internet-speed-upgrade",
            title: "দেশে ৫জি ইন্টারনেটের বাণিজ্যিক যাত্রা শুরু হচ্ছে আগামী মাসে",
            excerpt: "গ্রামীণফোন ও রবি একযোগে ঢাকা ও চট্টগ্রামে ৫জি সেবা চালু করতে প্রস্তুত।",
            body: [],
            category: "বিজ্ঞান ও প্রযুক্তি",
            categorySlug: "tech",
            author: "তানভীর আহমেদ",
            publishedAt: "২০২৬ অক্টোবর ৫",
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80",
            imageAlt: "৫জি টাওয়ার",
            readingTimeMin: 3,
        },
        {
            id: "7",
            slug: "space-tech-bangladesh",
            title: "বঙ্গবন্ধু স্যাটেলাইট-২ উৎক্ষেপণের তারিখ চূড়ান্ত",
            excerpt: "আগামী নভেম্বরে স্পেসএক্সের সহায়তায় বঙ্গবন্ধু স্যাটেলাইট-২ মহাকাশে পাঠানো হবে।",
            body: [],
            category: "বিজ্ঞান ও প্রযুক্তি",
            categorySlug: "tech",
            author: "সাবিনা ইয়াসমিন",
            publishedAt: "২০২৬ অক্টোবর ৪",
            imageUrl: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=500&q=80",
            imageAlt: "স্যাটেলাইট উৎক্ষেপণ",
            readingTimeMin: 4,
        },
    ],
    বিনোদন: [
        {
            id: "8",
            slug: "dhallywood-new-film",
            title: "চলচ্চিত্র 'জলের গান' কান উৎসবে পুরস্কার পেল",
            excerpt: "বাংলাদেশী পরিচালক মোস্তফা সরোয়ার ফারুকীর নতুন চলচ্চিত্র আন্তর্জাতিক মঞ্চে দেশের মুখ উজ্জ্বল করেছে।",
            body: [],
            category: "বিনোদন",
            categorySlug: "entertainment",
            author: "রিমা সুলতানা",
            publishedAt: "২০২৬ অক্টোবর ৬",
            imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80",
            imageAlt: "চলচ্চিত্র উৎসব",
            readingTimeMin: 4,
        },
        {
            id: "9",
            slug: "music-concert-dhaka",
            title: "ঢাকায় আসছেন এ আর রহমান, টিকিট বিক্রি শুরু কাল",
            excerpt: "আইকনিক সংগীতশিল্পী এ আর রহমানের ঢাকা কনসার্ট দেশের বিনোদন জগতে ঐতিহাসিক হয়ে উঠতে পারে।",
            body: [],
            category: "বিনোদন",
            categorySlug: "entertainment",
            author: "আনিকা রহমান",
            publishedAt: "২০২৬ অক্টোবর ৫",
            imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=500&q=80",
            imageAlt: "কনসার্ট মঞ্চ",
            readingTimeMin: 3,
        },
        {
            id: "10",
            slug: "ott-platform-bangla",
            title: "নতুন বাংলা ওটিটি প্ল্যাটফর্ম 'বাংলাফ্লিক্স' চালু",
            excerpt: "দেশীয় কন্টেন্টকে আন্তর্জাতিক মানে উপস্থাপন করতে নতুন এই স্ট্রিমিং সার্ভিস ১০,০০০ ঘণ্টার কন্টেন্ট নিয়ে শুরু হচ্ছে।",
            body: [],
            category: "বিনোদন",
            categorySlug: "entertainment",
            author: "কামাল উদ্দিন",
            publishedAt: "২০২৬ অক্টোবর ৪",
            imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&q=80",
            imageAlt: "ওটিটি স্ট্রিমিং",
            readingTimeMin: 3,
        },
    ],
    আন্তর্জাতিক: [
        {
            id: "11",
            slug: "un-climate-summit",
            title: "জাতিসংঘের জলবায়ু সম্মেলনে বাংলাদেশের দাবি: ক্ষতিপূরণ বাড়াতে হবে",
            excerpt: "পররাষ্ট্রমন্ত্রী জলবায়ু পরিবর্তনে সবচেয়ে ক্ষতিগ্রস্ত দেশ হিসেবে আরো বেশি আর্থিক সহায়তার দাবি তুলেছেন।",
            body: [],
            category: "আন্তর্জাতিক",
            categorySlug: "international",
            author: "জাহিদুল ইসলাম",
            publishedAt: "২০২৬ অক্টোবর ৬",
            imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=500&q=80",
            imageAlt: "জাতিসংঘ সদর দপ্তর",
            readingTimeMin: 5,
        },
        {
            id: "12",
            slug: "india-relations",
            title: "ভারত-বাংলাদেশ সীমান্ত বাণিজ্য চুক্তি নবায়নে সম্মতি",
            excerpt: "দুই দেশের বাণিজ্যমন্ত্রীদের বৈঠকে সীমান্ত হাটের সংখ্যা দ্বিগুণ করার সিদ্ধান্ত নেওয়া হয়েছে।",
            body: [],
            category: "আন্তর্জাতিক",
            categorySlug: "international",
            author: "সুমন বড়ুয়া",
            publishedAt: "২০২৬ অক্টোবর ৫",
            imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&q=80",
            imageAlt: "কূটনৈতিক বৈঠক",
            readingTimeMin: 4,
        },
        {
            id: "13",
            slug: "middle-east-workers",
            title: "মধ্যপ্রাচ্যে বাংলাদেশি শ্রমিকদের মজুরি বৃদ্ধির দাবিতে আলোচনা",
            excerpt: "শ্রম মন্ত্রণালয় সৌদি ও কুয়েত সরকারের সাথে নতুন শ্রম চুক্তির বিষয়ে আলোচনা শুরু করেছে।",
            body: [],
            category: "আন্তর্জাতিক",
            categorySlug: "international",
            author: "পারভীন আক্তার",
            publishedAt: "২০২৬ অক্টোবর ৪",
            imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&q=80",
            imageAlt: "প্রবাসী শ্রমিক",
            readingTimeMin: 4,
        },
    ],
};

// Additional category articles for comprehensive category pages and pagination
export const extraCategoryArticles: Article[] = [
    // Sports (খেলাধুলা)
    {
        id: "sports-2",
        slug: "bpl-cricket-tournament-final",
        title: "বিপিএলের ফাইনালে মুখোমুখি কুমিল্লা ও সিলেট",
        excerpt: "দারুণ ফর্ম ধরে রেখে দুই শক্তিশালী দল ফাইনালে উত্তীর্ণ হয়েছে। টিকিটের জন্য সমর্থকদের উপচে পড়া ভিড়।",
        body: [],
        category: "খেলাধুলা",
        categorySlug: "sports",
        author: "মাহবুব আলম",
        publishedAt: "২০২৬ অক্টোবর ৫",
        imageUrl: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=600&q=80",
        imageAlt: "ক্রিকেট খেলা",
        readingTimeMin: 3,
    },
    {
        id: "sports-3",
        slug: "shakib-al-hasan-record",
        title: "বিশ্বরেকর্ডের সামনে সাকিব আল হাসান: আর মাত্র ১ উইকেট প্রয়োজন",
        excerpt: "আন্তর্জাতিক টি-টোয়েন্টিতে প্রথম বোলার হিসেবে ১৫০ উইকেটের মাইলফলক স্পর্শ করার অপেক্ষায় সাকিব।",
        body: [],
        category: "খেলাধুলা",
        categorySlug: "sports",
        author: "রাহুল দে",
        publishedAt: "২০২৬ অক্টোবর ৪",
        imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=600&q=80",
        imageAlt: "ক্রিকেট পিচ",
        readingTimeMin: 4,
    },
    {
        id: "sports-4",
        slug: "football-premier-league-bangladesh",
        title: "বাংলাদেশ প্রিমিয়ার লিগ ফুটবল: শীর্ষে বসুন্ধরা কিংস",
        excerpt: "শেখ জামাল ধানমন্ডি ক্লাবকে ২-১ গোলে হারিয়ে পয়েন্ট টেবিলের একক শীর্ষে অবস্থান পোক্ত করল বসুন্ধরা কিংস।",
        body: [],
        category: "খেলাধুলা",
        categorySlug: "sports",
        author: "তাহমিদ জামান",
        publishedAt: "২০২৬ অক্টোবর ৩",
        imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80",
        imageAlt: "ফুটবল ম্যাচ",
        readingTimeMin: 3,
    },
    {
        id: "sports-5",
        slug: "women-cricket-world-cup",
        title: "নারী টি-টোয়েন্টি বিশ্বকাপ: উদ্বোধনী ম্যাচে দক্ষিণ আফ্রিকার বিপক্ষে নামছে বাংলাদেশ",
        excerpt: "অধিনায়ক নিগার সুলতানা জ্যোতির নেতৃত্বে দল সেমিফাইনাল খেলার লক্ষ্যে মাঠে নামবে বলে দৃঢ় প্রত্যয় ব্যক্ত করেছেন।",
        body: [],
        category: "খেলাধুলা",
        categorySlug: "sports",
        author: "রাহুল দে",
        publishedAt: "২০২৬ অক্টোবর ২",
        imageUrl: "https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&q=80",
        imageAlt: "ক্রিকেট স্টেডিয়াম",
        readingTimeMin: 4,
    },
    {
        id: "sports-6",
        slug: "mirpur-stadium-renovation",
        title: "মিরপুর শেরেবাংলা স্টেডিয়ামে বসছে অত্যাধুনিক ড্রেনেজ ব্যবস্থা",
        excerpt: "টানা বৃষ্টির পরও মাত্র ২০ মিনিটে খেলা শুরু করা যাবে এমন নতুন ড্রেনেজ সিস্টেম স্থাপন সম্পন্ন হয়েছে।",
        body: [],
        category: "খেলাধুলা",
        categorySlug: "sports",
        author: "মাহবুব আলম",
        publishedAt: "২০২৬ অক্টোবর ১",
        imageUrl: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&q=80",
        imageAlt: "স্টেডিয়াম গ্যালারি",
        readingTimeMin: 3,
    },
    {
        id: "sports-7",
        slug: "under19-cricket-asia-cup",
        title: "অনূর্ধ্ব-১৯ এশিয়া কাপ: ভারতের বিপক্ষে বাংলাদেশের শ্বাসরুদ্ধকর জয়",
        excerpt: "তরুণ ওপেনারের সেঞ্চুরিতে ভর করে ৩ উইকেটের জয়ে ফাইনালে পৌঁছাল বাংলাদেশের যুবারা।",
        body: [],
        category: "খেলাধুলা",
        categorySlug: "sports",
        author: "তাহমিদ জামান",
        publishedAt: "২০২৬ সেপ্টেম্বর ৩০",
        imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80",
        imageAlt: "ক্রিকেট ম্যাচ উদযাপন",
        readingTimeMin: 4,
    },
    // National (জাতীয়)
    {
        id: "national-2",
        slug: "metro-rail-new-stations",
        title: "মেট্রোরেলের নতুন তিন স্টেশন চালু: যাত্রী ভোগান্তি কমেছে",
        excerpt: "মতিঝিল থেকে কমলাপুর অংশের নতুন স্টেশনগুলো খুলে দেওয়ায় দৈনিক যাত্রী সংখ্যা সাড়ে তিন লাখে পৌঁছেছে।",
        body: [],
        category: "জাতীয়",
        categorySlug: "national",
        author: "মোহাম্মদ আলী ফারুকী",
        publishedAt: "২০২৬ অক্টোবর ৫",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
        imageAlt: "মেট্রোরেল স্টেশন",
        readingTimeMin: 3,
    },
    {
        id: "national-3",
        slug: "coxsbazar-deep-sea-port",
        title: "মাতারবাড়ি গভীর সমুদ্রবন্দরের প্রথম বাণিজ্যিক কার্যক্রম শুরু",
        excerpt: "বৃহৎ কনটেইনার জাহাজ ভেড়ার মাধ্যমে দেশের বৈদেশিক বাণিজ্যে এক নতুন দিগন্ত উন্মোচিত হলো।",
        body: [],
        category: "জাতীয়",
        categorySlug: "national",
        author: "সুমন বড়ুয়া",
        publishedAt: "২০২৬ অক্টোবর ৪",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80",
        imageAlt: "সমুদ্রবন্দর কার্যক্রম",
        readingTimeMin: 5,
    },
    {
        id: "national-4",
        slug: "padma-bridge-rail-connectivity",
        title: "পদ্মা সেতু হয়ে ঢাকা-খুলনা রুটে সরাসরি দ্রুতগামী ট্রেন সার্ভিস",
        excerpt: "যাতায়াতের সময় সাড়ে ৩ ঘণ্টায় নেমে আসায় দক্ষিণ-পশ্চিমাঞ্চলের অর্থনীতিতে অভূতপূর্ব গতি সঞ্চার হয়েছে।",
        body: [],
        category: "জাতীয়",
        categorySlug: "national",
        author: "মোহাম্মদ আলী ফারুকী",
        publishedAt: "২০২৬ অক্টোবর ৩",
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&q=80",
        imageAlt: "রেল যোগাযোগ ব্যবস্থা",
        readingTimeMin: 4,
    },
    // Politics (রাজনীতি)
    {
        id: "pol-2",
        slug: "election-commission-announcement",
        title: "নির্বাচন কমিশনের রোডম্যাপ ঘোষণা: সব দলের অংশগ্রহণের আহ্বান",
        excerpt: "প্রধান নির্বাচন কমিশনার জানিয়েছেন স্বচ্ছ ভোটগ্রহণে আধুনিক সিসিটিভি ও স্বচ্ছ ব্যালট নিশ্চিত করা হবে।",
        body: [],
        category: "রাজনীতি",
        categorySlug: "politics",
        author: "নাসরীন আক্তার",
        publishedAt: "২০২৬ অক্টোবর ৫",
        imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80",
        imageAlt: "নির্বাচন কমিশন সম্মেলন",
        readingTimeMin: 4,
    },
    {
        id: "pol-3",
        slug: "cabinet-meeting-key-decisions",
        title: "মন্ত্রিসভায় নতুন শিল্পনীতি অনুমোদন: বিনিয়োগকারীদের বিশেষ কর রেয়াত",
        excerpt: "প্রধানমন্ত্রী সভাপতিত্বে অনুষ্ঠিত বৈঠকে খাদ্য নিরাপত্তা ও গ্রামীণ কর্মসংস্থান অগ্রাধিকার দেওয়ার নির্দেশ।",
        body: [],
        category: "রাজনীতি",
        categorySlug: "politics",
        author: "নাসরীন আক্তার",
        publishedAt: "২০২৬ অক্টোবর ৪",
        imageUrl: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=600&q=80",
        imageAlt: "সরকারি প্রেস ব্রিফিং",
        readingTimeMin: 4,
    },
    // Economy (অর্থনীতি)
    {
        id: "econ-2",
        slug: "inflation-drop-bangladesh",
        title: "খাদ্য মুদ্রাস্ফীতি কমে এক অঙ্কের ঘরে নেমেছে: বাংলাদেশ পরিসংখ্যান ব্যুরো",
        excerpt: "সরবরাহ ব্যবস্থা স্বাভাবিক থাকায় নিত্যপ্রয়োজনীয় পণ্যের বাজারে স্বস্তি ফিরে আসতে শুরু করেছে।",
        body: [],
        category: "অর্থনীতি",
        categorySlug: "economy",
        author: "শাহানা বেগম",
        publishedAt: "২০২৬ অক্টোবর ৪",
        imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80",
        imageAlt: "অর্থনৈতিক পরিসংখ্যান",
        readingTimeMin: 4,
    },
    {
        id: "econ-3",
        slug: "stock-market-rally-dhaka",
        title: "ঢাকা স্টক এক্সচেঞ্জে মূল্যসূচকের বড় উল্লম্ফন: লেনদেন হাজার কোটি ছাড়াল",
        excerpt: "বিদেশি বিনিয়োগকারীদের আগ্রহ বৃদ্ধি ও প্রাতিষ্ঠানিক বিনিয়োগের ফলে শেয়ার বাজারে চাঞ্চল্য সৃষ্টি হয়েছে।",
        body: [],
        category: "অর্থনীতি",
        categorySlug: "economy",
        author: "শাহানা বেগম",
        publishedAt: "২০২৬ অক্টোবর ৩",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80",
        imageAlt: "পুঁজিবাজার লেনদেন",
        readingTimeMin: 3,
    },
    // Opinion (মতামত)
    {
        id: "op-1",
        slug: "editorial-water-management-dhaka",
        title: "নগর পরিকল্পনায় অবহেলা: জলাবদ্ধতার স্থায়ী সমাধান কোথায়?",
        excerpt: "ঢাকার প্রাকৃতিক খালগুলো দখলমুক্ত না করলে কোটি টাকার ড্রেনেজ প্রকল্প কখনোই ফলপ্রসূ হবে না।",
        body: [],
        category: "মতামত",
        categorySlug: "opinion",
        author: "প্রফেসর ড. মুস্তাক আহমেদ",
        authorDesignation: "নগর পরিকল্পনাবিদ ও অধ্যাপক, বুয়েট",
        authorPhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
        contentType: "opinion",
        publishedAt: "২০২৬ অক্টোবর ৬",
        imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&q=80",
        imageAlt: "সম্পাদকীয় কলাম",
        readingTimeMin: 5,
    },
    {
        id: "op-2",
        slug: "future-of-ai-education",
        title: "শিক্ষায় কৃত্রিম বুদ্ধিমত্তা: সম্ভাবনার নতুন দিগন্ত ও নৈতিক সংকট",
        excerpt: "শ্রেণিকক্ষে প্রযুক্তির সঠিক সমন্বয় ঘটাতে না পারলে নতুন প্রজন্ম বৈশ্বিক প্রতিযোগিতায় পিছিয়ে পড়বে।",
        body: [],
        category: "মতামত",
        categorySlug: "opinion",
        author: "ড. রোকেয়া সুলতানা",
        authorDesignation: "কৃত্রিম বুদ্ধিমত্তা গবেষক ও সহযোগী অধ্যাপক",
        authorPhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
        contentType: "opinion",
        publishedAt: "২০২৬ অক্টোবর ৫",
        imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&q=80",
        imageAlt: "বিশ্লেষণ ও আলোচনা",
        readingTimeMin: 6,
    },
];

export const allArticles: Article[] = [
    leadStory,
    ...subLeads,
    ...Object.values(categoryNews).flat(),
    ...extraCategoryArticles,
];

export function getArticleBySlug(slug: string): Article | undefined {
    return allArticles.find((a) => a.slug === slug);
}

export function getCategoryInfo(slug: string): CategoryInfo | undefined {
    return CATEGORIES.find(
        (c) => c.slug.toLowerCase() === slug.toLowerCase()
    );
}

export function getArticlesByCategory(categorySlug: string): Article[] {
    const slugLower = categorySlug.toLowerCase();
    const matched = allArticles.filter((a) => a.categorySlug.toLowerCase() === slugLower);

    // If matches are few, supplement with related articles so the grid and pagination look great
    if (matched.length > 0) {
        return matched;
    }

    return allArticles.filter((a) =>
        a.category.toLowerCase().includes(slugLower) ||
        a.categorySlug.toLowerCase() === slugLower
    );
}
