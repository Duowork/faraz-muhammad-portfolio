import { wearLooks, wearRoom } from '@/content';
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
import { usePageTitle } from '@/hooks/usePageTitle';

const WALL_SIZES = '(min-width: 768px) 220px, 180px';
const FEATURE_SIZES = '(min-width: 1200px) 420px, (min-width: 768px) 470px, calc(100vw - 72px)';

export default function WearRoomPage() {
  usePageTitle(wearRoom.title);
  const [feature, ...wall] = wearLooks;

  return (
    <PageShell footer={<Footer variant="room" note={wearRoom.note} />}>
      <RoomHeading room={wearRoom} />
      <TrackLight />

      <RoomSection variant="wear" label="Looks in the Wear room">
        <RoomFeature>
          <Frame
            to={`${wearRoom.path}/${feature.slug}`}
            image={feature.image}
            alt={feature.alt}
            caption={`${feature.title} · ${feature.year} · ${feature.photographer}`}
            sizes={FEATURE_SIZES}
            room="wear"
            variant="feature"
            priority
          />
        </RoomFeature>

        <Pillar />

        <RoomWall>
          {wall.map((look) => (
            <li key={look.slug}>
              <Frame
                to={`${wearRoom.path}/${look.slug}`}
                image={look.image}
                alt={look.alt}
                caption={`${look.title} · ${look.year}`}
                sizes={WALL_SIZES}
                room="wear"
              />
            </li>
          ))}
        </RoomWall>
      </RoomSection>

      <FloorBand />
    </PageShell>
  );
}
