import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer, Nav } from "../site";
import { blogPosts, type BlogPost } from "./posts";

export const metadata: Metadata = {
  title: "Blackcrab Devlog",
  description:
    "Product notes, design rationale, and engineering tradeoffs from building Blackcrab.",
};

export default function BlogPage() {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <main className="flex-1 w-full">
      <Nav />
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 sm:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-center">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-accent">
              Blackcrab Devlog
            </span>
            <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
              Product notes from building a Claude Code workspace.
            </h1>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              A focused blog for design decisions, engineering tradeoffs,
              release notes, and the practical details behind Blackcrab.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/changelog"
                className="rounded-md bg-accent text-white px-4 py-2 text-sm font-medium hover:bg-accent/90 transition"
              >
                Changelog
              </Link>
              <Link
                href="/docs"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
              >
                Docs
              </Link>
            </div>
          </div>

          <div className="flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl border border-border bg-[#0c0c0c] p-10 sm:p-12">
            <Image
              src="/blackcrab_logo.png"
              alt="Blackcrab logo"
              width={318}
              height={310}
              sizes="(min-width: 1024px) 224px, 45vw"
              className="h-auto w-40 sm:w-52 lg:w-56"
              priority
            />
          </div>
        </div>

        {featuredPost ? (
          <section className="mt-16 border-t border-border pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr] gap-6 lg:gap-12">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  Latest
                </span>
              </div>
              <FeaturedPost post={featuredPost} />
            </div>
          </section>
        ) : null}

        <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-px overflow-hidden rounded-xl bg-border">
          {remainingPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </section>
      </section>
      <Footer />
    </main>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article>
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-muted">
        <span className="text-accent">{post.category}</span>
        <span>{post.displayDate}</span>
        <span>{post.readTime}</span>
      </div>
      <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}`} className="hover:text-accent transition">
          {post.title}
        </Link>
      </h2>
      <p className="mt-4 max-w-3xl text-lg text-muted leading-relaxed">
        {post.dek}
      </p>
      <TagList tags={post.tags} />
      <Link
        href={`/blog/${post.slug}`}
        className="mt-6 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium hover:border-foreground/40 transition"
      >
        Read the note
      </Link>
    </article>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-background p-6 sm:p-7">
      <div className="flex flex-wrap items-center gap-3 text-xs font-mono uppercase tracking-wider text-muted">
        <span className="text-accent">{post.category}</span>
        <span>{post.displayDate}</span>
      </div>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight">
        <Link href={`/blog/${post.slug}`} className="hover:text-accent transition">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 text-sm text-muted leading-relaxed">{post.dek}</p>
      <TagList tags={post.tags} />
    </article>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded border border-border bg-white/[0.03] px-2 py-1 text-xs text-muted"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
