import "./blog.css";
import Footer from "@/components/Footer/Footer";
import { blogPosts } from "@/data/blogPosts";

// <a> normal (no <Link>): los artículos son experiencias estáticas fuera del router de Next.
const Page = () => {
  return (
    <div className="blog-page">
      <header className="container blog-header">
        <p className="blog-eyebrow">SIGIL LABS / Blog</p>
        <h1>Blog</h1>
        <p className="blog-intro">
          Investigación con datos, contada como experiencia web. Un artículo
          interactivo a la vez.
        </p>
      </header>

      <section className="container blog-grid" aria-label="Artículos">
        {blogPosts.map((post) => (
          <a className="blog-card" href={`/blog/${post.slug}`} key={post.slug}>
            <div className="blog-card-img">
              <img src={post.image} alt={post.title} width="1200" height="630" loading="lazy" />
            </div>
            <div className="blog-card-body">
              <span className="blog-tag">{post.tag}</span>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span className="blog-meta">
                {new Date(post.date).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })} · {post.readingTime}
              </span>
            </div>
          </a>
        ))}
      </section>

      <Footer />
    </div>
  );
};

export default Page;
