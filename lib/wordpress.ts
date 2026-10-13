const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "https://techcrunch.com/wp-json/wp/v2"; // Default fallback ya aap apna WordPress site URL daal sakte hain

export async function fetchWordPressPosts() {
  try {
    const res = await fetch(`${WP_API_URL}/posts?per_page=4&_embed`, {
      next: { revalidate: 60 }, // ISR: Revalidate every 60 seconds
    });
    if (!res.ok) throw new Error("Failed to fetch WordPress posts");
    return await res.json();
  } catch (err) {
    console.error("WordPress API Error:", err);
    return [];
  }
}

export async function fetchWordPressPostById(id: string) {
  const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || "https://techcrunch.com/wp-json/wp/v2";

  try {
    const res = await fetch(`${WP_API_URL}/posts/${id}?_embed`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch post");
    return await res.json();
  } catch (err) {
    console.error("WordPress Single Post Fetch Error:", err);
    return null;
  }
}