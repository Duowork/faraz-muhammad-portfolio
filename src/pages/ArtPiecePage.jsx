import { useParams } from 'react-router';
import { artRoom, artWorks, findIndexBySlug, instagramUrlFor } from '@/content';
import InquiryForm from '@/components/forms/InquiryForm';
import Arrow from '@/components/ui/Arrow';
import ExternalLink from '@/components/ui/ExternalLink';
import { ViewerControls, ViewerThumbnails } from '@/components/viewer/ViewerControls';
import ViewerLayout from '@/components/viewer/ViewerLayout';
import {
  ViewerActions,
  ViewerHeading,
  ViewerMeta,
  ViewerSection,
} from '@/components/viewer/ViewerPanel';
import ViewerStage from '@/components/viewer/ViewerStage';
import { useGalleryViewer } from '@/components/viewer/useGalleryViewer';
import { usePageTitle } from '@/hooks/usePageTitle';
import NotFoundPage from './NotFoundPage';

/** /art/:slug, e.g. /art/untitled-iv. Unknown slugs show the 404 page. */
export default function ArtPiecePage() {
  const { slug } = useParams();
  const index = findIndexBySlug(artWorks, slug);
  if (index === -1) return <NotFoundPage />;
  return <ArtPieceViewer index={index} />;
}

/** @param {{ index: number }} props */
function ArtPieceViewer({ index }) {
  const work = artWorks[index];
  const viewer = useGalleryViewer({ items: artWorks, index, room: artRoom });
  usePageTitle(work.title);

  return (
    <ViewerLayout
      room={artRoom}
      item={work}
      index={index}
      total={artWorks.length}
      closeLabel="Close piece view"
      stage={
        <>
          <ViewerStage
            items={artWorks}
            index={index}
            variant="art"
            onPrev={viewer.goPrev}
            onNext={viewer.goNext}
          />
          <ViewerControls noun="piece" onPrev={viewer.goPrev} onNext={viewer.goNext} />
          <ViewerThumbnails
            items={artWorks}
            index={index}
            onSelect={viewer.goTo}
            label="All pieces"
            variant="art"
          />
        </>
      }
      panel={
        <>
          <ViewerHeading eyebrow={`${artRoom.title} · ${artRoom.number}`} title={work.title} />
          <ViewerMeta>
            {work.year} · {work.medium} · {work.dimensions}
            <br />
            Price on request
          </ViewerMeta>
          <ViewerActions>
            <ExternalLink href={instagramUrlFor(work)} className="btn btn-sm btn-outline">
              View on Instagram <Arrow>↗</Arrow>
            </ExternalLink>
          </ViewerActions>
          <ViewerSection id="inquire">
            {/* Keyed so the form resets when moving to another piece. */}
            <InquiryForm key={work.slug} piece={work} />
          </ViewerSection>
        </>
      }
    />
  );
}
