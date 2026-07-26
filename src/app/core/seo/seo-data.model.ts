/** Route-level SEO metadata (spec: "Route-level SEO architecture"). */
export interface SeoData {
  title: string;
  description: string;
  /** Absolute-path canonical, e.g. '/' or '/calculator'. Combined with SITE_URL. */
  canonicalPath: string;
  robots?: string;
  keywords?: readonly string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterDescription?: string;
}
