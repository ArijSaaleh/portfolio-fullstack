import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ShareButtons from "../components/ShareButtons";
import SEOHead from "../components/SEOHead";
import StructuredData from "../components/StructuredData";

import { getBlogBySlug, type Blog } from "../services/dataService";
import { resolveMediaUrl } from "../utils/mediaResolver";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    fetchBlog();
  }, [slug]);


  const fetchBlog = async () => {
    try {
      const foundBlog = await getBlogBySlug(slug!);

      if (foundBlog) {
        setBlog(foundBlog);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "tutorial":
        return "bg-blue-100 text-blue-800";
      case "article":
        return "bg-green-100 text-green-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const blogImage =
    blog.thumbnail ||
    (blog.pdfUrl ? `${blog.pdfUrl}#page=1` : "");

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={blog.title}
        description={blog.excerpt.replace(/<[^>]*>/g, "")}
        image={blogImage}
        url={currentUrl}
        type="article"
        publishedTime={blog.publishedAt}
      />
      <StructuredData
        type="Article"
        data={{
          title: blog.title,
          description: blog.excerpt.replace(/<[^>]*>/g, ""),
          image: blogImage,
          url: currentUrl,
          publishedAt: blog.publishedAt,
        }}
      />

      {/* Header with back button */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
        </div>
      </header>

      {/* Blog content */}
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Hero image or thumbnail */}
        {blog.thumbnail && !blog.pdfUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={resolveMediaUrl(blog.thumbnail)}
              alt={blog.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        {/* Blog header */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeBadgeColor(
                blog.type
              )} flex items-center gap-1`}
            >
              <Tag className="w-3 h-3" />
              {blog.type.charAt(0).toUpperCase() + blog.type.slice(1)}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(blog.publishedAt)}
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {blog.readTime} min read
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>

          <div
            className="text-lg text-muted-foreground prose prose-lg max-w-none mb-6"
            dangerouslySetInnerHTML={{ __html: blog.excerpt }}
          />

          <div className="flex items-center justify-between py-4 border-y">
            <ShareButtons
              url={currentUrl}
              title={blog.title}
              description={blog.excerpt.replace(/<[^>]*>/g, "")}
            />
            {blog.pdfUrl && (
              <div className="flex items-center gap-3">
                <a
                  href={blog.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-2 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open in new tab
                </a>
                <a
                  href={blog.pdfUrl}
                  download
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
        {/* Blog content - only show if not PDF-only post */}
        {blog.content && blog.content.trim() && (
          <article className="prose prose-lg max-w-4xl mx-auto dark:prose-invert mb-8">
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>
        )}
        {/* Video embed for video type */}
        {blog.type === "video" && blog.videoUrl && (
          <Card className="mb-8 max-w-5xl mx-auto">
            <CardContent className="p-0">
              <div className="aspect-video">
                <iframe
                  src={blog.videoUrl.replace("watch?v=", "embed/")}
                  title={blog.title}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* PDF embed if available - full width with side margins */}
        {blog.pdfUrl && (
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-0">
              <div className="bg-muted/30 p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Document Viewer</h3>
                    <p className="text-xs text-muted-foreground">
                      Scroll to read the full document
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(blog.pdfUrl, "_blank")}
                    className="gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = blog.pdfUrl!;
                      link.download = `${blog.title}.pdf`;
                      link.click();
                    }}
                    className="gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download
                  </Button>
                </div>
              </div>
              <div className="h-[800px] bg-muted">
                <iframe
                  src={resolveMediaUrl(blog.pdfUrl, { type: 'pdf' })}
                  title={`${blog.title} PDF`}
                  className="w-full h-full"
                  style={{ border: "none" }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back button at bottom */}
        <div className="mt-12 pt-8 border-t max-w-4xl mx-auto">
          <Button onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Portfolio
          </Button>
        </div>
      </main>
    </div>
  );
}
