import type { Metadata } from "next";
import BreakingTicker from "@/components/BreakingTicker";
import Navbar from "@/components/Navbar";
import LeadStoryCard from "@/components/LeadStoryCard";
import SubLeadsColumn from "@/components/SubLeadsColumn";
import CategoryGrid from "@/components/CategoryGrid";
import Footer from "@/components/Footer";
import AdSlot from "@/components/AdSlot";
import { leadStory, subLeads, categoryNews } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "নয়া বাংলা — বাংলাদেশের নির্ভরযোগ্য সংবাদ",
  description:
    "বাংলাদেশ ও বিশ্বের সর্বশেষ খবর পড়ুন। রাজনীতি, অর্থনীতি, খেলাধুলা, বিনোদন ও প্রযুক্তি সংবাদ।",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BreakingTicker />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">

        {/* ─── Hero: Lead + Sub-leads ─── */}
        <section
          className="pb-10 mb-10"
          style={{ borderBottom: "1px solid var(--border-primary)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Lead Story — 7 columns */}
            <div className="lg:col-span-7">
              <LeadStoryCard article={leadStory} />
            </div>

            {/* Sub-leads sidebar — 5 columns */}
            <div
              className="lg:col-span-5 lg:pl-8"
              style={{ borderLeft: "1px solid var(--border-primary)" }}
            >
              <h2
                className="section-heading text-base font-bold mb-4"
                style={{ fontFamily: "var(--font-headline)", color: "var(--accent-navy)" }}
              >
                শীর্ষ সংবাদ
              </h2>
              <SubLeadsColumn articles={subLeads} />
            </div>
          </div>
        </section>

        {/* ─── EXPANDED AD SLOT: Homepage Mid-feed (Task 6) ─── */}
        <AdSlot format="mid-feed" slotName="হোমপেজ মিড-ফিড প্রিমিয়াম ব্যানার" />

        {/* ─── Section Divider ─── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "var(--border-primary)" }} />
          <span
            className="text-xs font-semibold tracking-wide px-3 py-1"
            style={{
              color: "var(--text-muted)",
              fontFamily: "var(--font-headline)",
              background: "var(--bg-surface)",
              borderRadius: "2px",
            }}
          >
            বিভাগ অনুযায়ী খবর
          </span>
          <div className="flex-1 h-px" style={{ background: "var(--border-primary)" }} />
        </div>

        {/* ─── Category Sections ─── */}
        <div className="flex flex-col gap-16">
          <CategoryGrid
            categoryLabel="বিজ্ঞান ও প্রযুক্তি"
            categorySlug="tech"
            articles={categoryNews["বিজ্ঞান_প্রযুক্তি"]}
          />
          <CategoryGrid
            categoryLabel="বিনোদন"
            categorySlug="entertainment"
            articles={categoryNews["বিনোদন"]}
          />
          <CategoryGrid
            categoryLabel="আন্তর্জাতিক"
            categorySlug="international"
            articles={categoryNews["আন্তর্জাতিক"]}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
