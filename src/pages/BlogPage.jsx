import { blog } from '@/content';
import FeaturedPost from '@/components/blog/FeaturedPost';
import PostList from '@/components/blog/PostList';
import Footer from '@/components/layout/Footer';
import PageShell from '@/components/layout/PageShell';
import Arrow from '@/components/ui/Arrow';
import Band from '@/components/ui/Band';
import ExternalLink from '@/components/ui/ExternalLink';
import { usePageTitle } from '@/hooks/usePageTitle';
import { platformLabel, splitFeatured } from '@/lib/blog';
import { cx } from '@/lib/cx';
import styles from './BlogPage.module.css';

const { featured, rest } = splitFeatured(blog.posts);
const platforms = Object.entries(blog.platforms);

/** /blog: a curated reading list. Every post opens on Medium or Substack. */
export default function BlogPage() {
  usePageTitle('Blog');

  return (
    <PageShell footer={<Footer variant="instagram" />}>
      <div className={styles.page}>
        <section className={styles.intro} aria-labelledby="blog-title">
          <p className={cx('label muted', styles.eyebrow)}>
            Writing · on {platforms.map(([, platform]) => platform.label).join(' & ')}
          </p>
          <h1 id="blog-title" className={styles.title}>
            Blog
          </h1>
          <p className={styles.lede}>{blog.intro}</p>
        </section>

        {featured ? (
          <FeaturedPost
            post={featured}
            platformLabel={platformLabel(blog.platforms, featured.platform)}
          />
        ) : null}

        {rest.length > 0 ? (
          <section className={styles.more} aria-labelledby="more-title">
            <h2 id="more-title" className={cx('label muted', styles.moreLabel)}>
              More writing
            </h2>
            <PostList posts={rest} platforms={blog.platforms} />
          </section>
        ) : null}
      </div>

      <Band variant="buttons" text="Follow the writing.">
        {platforms.map(([key, platform]) => (
          <ExternalLink key={key} href={platform.profileUrl} className="btn btn-sm btn-outline">
            {platform.label} <Arrow>↗</Arrow>
          </ExternalLink>
        ))}
      </Band>
    </PageShell>
  );
}
