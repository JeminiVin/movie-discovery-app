import React, { Suspense } from "react";
import { fetchWordPressPostById } from "@/lib/wordpress";
import { ArrowLeft, Calendar, User, Newspaper } from "lucide-react";
import Link from "next/link";

// Next.js ko pre-render error se bachane ke liye force-dynamic set karein
export const dynamic = "force-dynamic";

async function BlogContent({ id }: { id: string }) {
  const post = await fetchWordPressPostById(id);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-[#0f172a] font-sans">
        <h1 className="text-2xl font-bold font-serif mb-4">Article Not Found</h1>
        <Link href="/" className="text-sm text-[#0284c7] underline font-mono">
          &larr; Back to Catalog
        </Link>
      </div>
    );
  }

  const featuredImage =
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";

  const authorName = post._embedded?.author?.[0]?.name || "CineStream Editorial";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans">
      {/* Header Bar */}
      <div className="bg-[#0f172a] text-white py-6 px-6 lg:px-12 border-b border-[#334155]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#94a3b8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery Catalog</span>
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#0284c7]">
            <Newspaper className="w-4 h-4" />
            <span>Headless Article</span>
          </span>
        </div>
      </div>

      {/* Article Content Container */}
      <article className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Title & Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#64748b]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0284c7]" />
              {new Date(post.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0284c7]" />
              {authorName}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-serif font-bold text-[#0f172a] leading-tight"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg bg-[#e2e8f0]">
          <img
            src={featuredImage}
            alt={post.title.rendered}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div
          className="prose prose-slate max-w-none text-base font-normal leading-relaxed text-[#334155] space-y-4"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    </div>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-mono text-xs text-[#64748b]">
          Loading Article...
        </div>
      }
    >
      <BlogContent id={resolvedParams.id} />
    </Suspense>
  );
}