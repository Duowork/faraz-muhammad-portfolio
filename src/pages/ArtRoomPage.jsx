import { artRoom, artWorks } from '@/content';
import Frame from '@/components/gallery/Frame';
import RoomHeading from '@/components/gallery/RoomHeading';
import {
  FloorBand,
  Pillar,
  RoomFeature,
  RoomSection,
  RoomWall,
  TrackLight,
} from '@/components/gallery/RoomParts';
import Footer from '@/components/layout/Footer';
import PageShell from '@/components/layout/PageShell';
import TransitionLink from '@/components/ui/TransitionLink';
import { usePageTitle } from '@/hooks/usePageTitle';

const WALL_SIZES = '(min-width: 1200px) 200px, (min-width: 768px) 340px, 170px';
const FEATURE_SIZES = '(min-width: 1200px) 470px, (min-width: 768px) 520px, calc(100vw - 72px)';

export default function ArtRoomPage() {
  usePageTitle(artRoom.title);
  const [feature, ...wall] = artWorks;

  return (
    <PageShell footer={<Footer variant="room" note={artRoom.note} />}>
      <RoomHeading room={artRoom} />
      <TrackLight />

      <RoomSection variant="art" label="Works in the Art room">
        <RoomWall>
          {wall.map((work) => (
            <li key={work.slug}>
              <Frame
                to={`${artRoom.path}/${work.slug}`}
                image={work.image}
                alt={work.alt}
                caption={`${work.title} · ${work.year}`}
                sizes={WALL_SIZES}
                room="art"
              />
            </li>
          ))}
        </RoomWall>

        <Pillar />

        <RoomFeature
          action={
            <TransitionLink
              to={`${artRoom.path}/${feature.slug}#inquire`}
              className="btn btn-outline"
              aria-label={`Inquire about ${feature.title}`}
            >
              Inquire
            </TransitionLink>
          }
        >
          <Frame
            to={`${artRoom.path}/${feature.slug}`}
            image={feature.image}
            alt={feature.alt}
            caption={`${feature.title} · ${feature.year} · ${feature.medium}`}
            sizes={FEATURE_SIZES}
            room="art"
            variant="feature"
            priority
          />
        </RoomFeature>
      </RoomSection>

      <FloorBand />
    </PageShell>
  );
}
