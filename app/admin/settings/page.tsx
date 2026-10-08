export default function AdminSettingsPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="pb-6 border-b border-slate-200">
                <h1
                    className="text-2xl font-extrabold text-slate-900"
                    style={{ fontFamily: "var(--font-headline)" }}
                >
                    সিস্টেম সেটিংস (Settings)
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    সার্ভার, নিরাপত্তা, এসইও এবং এপিআই সংযোগ সংক্রান্ত পরামিতি।
                </p>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-2xs space-y-4 max-w-2xl">
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                        পোর্টাল ডোমেন
                    </label>
                    <input
                        type="text"
                        disabled
                        value="https://noyabangla.com.bd"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded text-slate-600"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" style={{ fontFamily: "var(--font-headline)" }}>
                        সার্ভার এনভায়রনমেন্ট
                    </label>
                    <input
                        type="text"
                        disabled
                        value="Next.js 14 App Router • Production Ready"
                        className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded text-slate-600"
                    />
                </div>
            </div>
        </div>
    );
}
