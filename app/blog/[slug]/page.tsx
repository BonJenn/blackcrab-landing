import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer, Nav } from "../../site";
import { blogPosts, getBlogPost, type BlogPost } from "../posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Blackcrab Devlog",
    };
  }

  return {
    title: `${post.title} - Blackcrab Devlog`,
    description: post.dek,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug);

  return (
    <main className="flex-1 w-full">
      <Nav />
      <article className="mx-auto max-w-6xl px-6 pt-12 pb-20 sm:pt-20">
        <Link
          href="/blog"
          className="inline-flex text-sm text-muted hover:text-foreground transition"
        >
          Back to devlog
        </Link>

        <header className="mt-8 grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-14 border-b border-border pb-12">
          <aside className="space-y-5 text-sm text-muted">
            <div>
              <div className="font-mono text-xs uppercase tracking-wider text-accent">
                {post.category}
              </div>
              <div className="mt-2">{post.displayDate}</div>
              <div>{post.readTime}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-border bg-white/[0.03] px-2 py-1 text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </aside>

          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-tight">
              {post.title}
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed">
              {post.dek}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-8 lg:gap-14 pt-12">
          <div className="hidden lg:block" />
          <div className="max-w-3xl space-y-12">
            {post.sections.map((section) => (
              <PostSection key={section.heading} section={section} />
            ))}
          </div>
        </div>
      </article>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="border-t border-border pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">More devlog</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-xl bg-border">
            {relatedPosts.map((item) => (
              <RelatedPost key={item.slug} post={item} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PostSection({
  section,
}: {
  section: BlogPost["sections"][number];
}) {
  return (
    <section>
      <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
        {section.heading}
      </h2>
      <div className="mt-5 space-y-5 text-muted leading-relaxed">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {section.bullets ? (
        <ul className="mt-6 space-y-3 list-disc pl-5 text-muted leading-relaxed">
          {section.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function RelatedPost({ post }: { post: BlogPost }) {
  return (
    <article className="bg-background p-6">
      <div className="text-xs font-mono uppercase tracking-wider text-accent">
        {post.category}
      </div>
      <h3 className="mt-3 text-xl font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}`} className="hover:text-accent transition">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 text-sm text-muted leading-relaxed">{post.dek}</p>
    </article>
  );
}
