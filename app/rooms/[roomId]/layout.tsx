import type { Metadata } from "next";

const ROOM_NAMES: Record<string, string> = {
  standard: "Standard Room",
  deluxe: "Deluxe Room",
  family: "Family Suite",
};

type Props = {
  children: React.ReactNode;
  params: { roomId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { roomId } = params;
  const name = ROOM_NAMES[roomId] || "Room";
  const title = `${name}`;
  const description = `${name} at Lemach Hotel & Accommodations, Kilifi County, Kenya. Book your stay.`;

  return {
    title,
    description,
    openGraph: {
      title: `${name} | Lemach Hotel & Accommodations`,
      description,
      url: `https://lemach.co.ke/rooms/${roomId}`,
    },
  };
}

export default function RoomLayout({ children }: Props) {
  return <>{children}</>;
}
