import { useParams } from 'react-router';
import { findIndexBySlug, instagramUrlFor, wearLooks, wearRoom } from '@/content';
import Arrow from '@/components/ui/Arrow';
import ExternalLink from '@/components/ui/ExternalLink';
import { ViewerControls, ViewerThumbnails } from '@/components/viewer/ViewerControls';
import ViewerLayout from '@/components/viewer/ViewerLayout';
import {
  ViewerActions,
  ViewerCaption,
  ViewerHeading,
  ViewerMeta,
  ViewerSection,
} from '@/components/viewer/ViewerPanel';
import ViewerStage from '@/components/viewer/ViewerStage';
import { useGalleryViewer } from '@/components/viewer/useGalleryViewer';
import { usePageTitle } from '@/hooks/usePageTitle';
import NotFoundPage from './NotFoundPage';

/** /wear/:slug, e.g. /wear/look-iii. Unknown slugs show the 404 page. */
export default function WearLookPage() {
  const { slug } = useParams();
  const index = findIndexBySlug(wearLooks, slug);
  if (index === -1) return <NotFoundPage />;
  return <WearLookViewer index={index} />;
}

/** @param {{ index: number }} props */
function WearLookViewer({ index }) {
  const look = wearLooks[index];
  const viewer = useGalleryViewer({ items: wearLooks, index, room: wearRoom });
  usePageTitle(look.title);

  return (
    <ViewerLayout
      room={wearRoom}
      item={look}
      index={index}
      total={wearLooks.length}
      closeLabel="Close look viewer"
      stage={
        <>
          <ViewerStage
            items={wearLooks}
            index={index}
            variant="wear"
            onPrev={viewer.goPrev}
            onNext={viewer.goNext}
          />
          <ViewerControls noun="look" onPrev={viewer.goPrev} onNext={viewer.goNext} />
        </>
      }
      panel={
        <>
          <ViewerHeading eyebrow={`${wearRoom.title} · ${wearRoom.number}`} title={look.title} />
          <ViewerMeta>
            {look.year} · {look.photographer} · {look.styling}
          </ViewerMeta>
          <ViewerCaption>{look.caption}</ViewerCaption>
          <ViewerActions>
            <ExternalLink href={instagramUrlFor(look)} className="btn btn-sm btn-outline">
              View on Instagram <Arrow>↗</Arrow>
            </ExternalLink>
          </ViewerActions>
          <ViewerSection label="All looks">
            <ViewerThumbnails
              items={wearLooks}
              index={index}
              onSelect={viewer.goTo}
              label="All looks"
              variant="wear"
              placement="panel"
            />
          </ViewerSection>
        </>
      }
    />
  );
}
