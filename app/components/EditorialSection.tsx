"use client";

import React, { useEffect, useState } from "react";
import { fetchWordPressPosts } from "@/lib/wordpress";
import { Newspaper, ArrowRight, Loader2, Calendar } from "lucide-react";
import Link from "next/link";

export default function EditorialSection() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPosts() {
            setLoading(true);
            const data = await fetchWordPressPosts();
            setPosts(data);
            setLoading(false);
        }
        loadPosts();
    }, []);

    if (loading) {
        return (
            <div className="py-12 text-center flex items-center justify-center gap-2 text-xs font-mono text-[#64748b]">
                <Loader2 className="w-4 h-4 animate-spin text-[#0284c7]" />
                <span>Loading WordPress Editorial Stories...</span>
            </div>
        );
    }

    if (posts.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 border-t border-[#e2e8f0]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#0284c7] bg-[#0284c7]/10 px-3 py-1 rounded-md mb-2">
                        <Newspaper className="w-3.5 h-3.5" />
                        <span>Headless CMS Integration</span>
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a]">
                        Latest Cinematic Reviews & Articles
                    </h2>
                </div>
                <p className="text-xs text-[#64748b] font-mono">
                    Powered live via WordPress REST API Engine
                </p>
            </div>

            {/* WordPress Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {posts.map((post) => {
                    const featuredImage =
                        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80";

                    return (
                        <div
                            key={post.id}
                            className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div className="relative aspect-[16/10] overflow-hidden bg-[#f1f5f9]">
                                <img
                                    src={featuredImage}
                                    alt={post.title.rendered}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>

                            <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#64748b]">
                                        <Calendar className="w-3 h-3 text-[#0284c7]" />
                                        <span>{new Date(post.date).toLocaleDateString()}</span>
                                    </div>
                                    <h3
                                        className="font-serif text-base font-bold text-[#0f172a] line-clamp-2 group-hover:text-[#0284c7] transition-colors"
                                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                                    />
                                    <p
                                        className="text-xs text-[#64748b] line-clamp-2 font-light leading-relaxed"
                                        dangerouslySetInnerHTML={{
                                            __html: post.excerpt.rendered.replace(/<[^>]*>?/gm, ""),
                                        }}
                                    />
                                </div>

                                <Link
                                    href={`/blog/${post.id}`}
                                    className="pt-2 flex items-center gap-1.5 text-xs font-mono font-bold text-[#0284c7] hover:underline cursor-pointer"
                                >
                                    <span>Read Full Article</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}