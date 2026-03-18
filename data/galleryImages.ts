export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "rooms" | "dining" | "events" | "facilities" | "exterior";
  title?: string;
}

const cld = (src: string, transform: string) => src.replace("/image/upload/", `/image/upload/${transform}/`);

export const galleryImages: GalleryImage[] = [
  // Rooms Category
  {
    id: "room-1",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS12of5621_d09e4v.jpg", "f_auto,q_auto,w_1600"),
    alt: "Standard Room",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-2",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS16of562_ouub2u.jpg", "f_auto,q_auto,w_1600"),
    alt: "Standard Room - Photo 2",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-3",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837496/LEMACHGARDENS17of562_wefrcn.jpg", "f_auto,q_auto,w_1600"),
    alt: "Standard Room - Photo 3",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-4",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS14of562_tkmzvc.jpg", "f_auto,q_auto,w_1600"),
    alt: "Standard Room - Photo 4",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-5",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS6of562_x8fn3x.jpg", "f_auto,q_auto,w_1600"),
    alt: "Standard Room - Photo 5",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-6",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS11of562_jh9vzn.jpg", "f_auto,q_auto,w_1600"),
    alt: "Standard Room - Photo 6",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-7",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS7of562_cohiqd.jpg", "f_auto,q_auto,w_1600"),
    alt: "Standard Room - Photo 7",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-8",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773837495/LEMACHGARDENS8of562_zcckde.jpg", "f_auto,q_auto,w_1600"),
    alt: "Standard Room - Photo 8",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-9",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS333of562_kjjury.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 1",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-10",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS337of562_ehegod.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 2",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-11",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839990/LEMACHGARDENS339of562_goabil.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 3",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-12",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS330of562_j5zdhm.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 4",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-13",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS332of562_u2i6bj.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 5",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-14",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS328of562_al2oim.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 6",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-15",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS331of562_jsv5x6.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 7",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-16",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS317of562_kplmrj.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 8",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-17",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839989/LEMACHGARDENS319of562_fnigu4.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 9",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-18",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS302of562_n3f4y7.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 10",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-19",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS300of562_uhl0eq.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 11",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-20",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773839988/LEMACHGARDENS301of562_w5lzhz.jpg", "f_auto,q_auto,w_1600"),
    alt: "Deluxe Room / Family Suite - Photo 12",
    category: "rooms",
    title: "Deluxe Room / Family Suite",
  },
  {
    id: "room-21",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014494/IMG_2944_cvtn8r.jpg",
    alt: "Luxurious Accommodations",
    category: "rooms",
    title: "Luxurious Accommodations",
  },

  // Dining Category
  {
    id: "dining-1",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014494/IMG_2948_kzpa8s.jpg",
    alt: "Restaurant Interior",
    category: "dining",
    title: "Restaurant Interior",
  },
  {
    id: "dining-2",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014496/IMG_20250710_182533_vsppzh.jpg",
    alt: "Dining Area",
    category: "dining",
    title: "Dining Area",
  },

  // Events Category
  {
    id: "event-1",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_2958_dsuafs.jpg", "f_auto,q_auto,w_1600"),
    alt: "Event Hall",
    category: "events",
    title: "Event Hall",
  },
  {
    id: "event-2",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841224/Boardroom_1_hfa8v2.jpg", "f_auto,q_auto,w_1600"),
    alt: "Boardroom - Photo 1",
    category: "events",
    title: "Boardroom",
  },
  {
    id: "event-3",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841224/Boardroom_2_ybp800.jpg", "f_auto,q_auto,w_1600"),
    alt: "Boardroom - Photo 2",
    category: "events",
    title: "Boardroom",
  },
  {
    id: "event-4",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841224/Boardroom_3_emkdbq.jpg", "f_auto,q_auto,w_1600"),
    alt: "Boardroom - Photo 3",
    category: "events",
    title: "Boardroom",
  },
  {
    id: "event-5",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841223/Boardroom_4_csx5me.jpg", "f_auto,q_auto,w_1600"),
    alt: "Boardroom - Photo 4",
    category: "events",
    title: "Boardroom",
  },
  {
    id: "event-6",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841223/Boardroom_5_lf2hqj.jpg", "f_auto,q_auto,w_1600"),
    alt: "Boardroom - Photo 5",
    category: "events",
    title: "Boardroom",
  },
  {
    id: "event-7",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841223/Boardroom_6_bx9clk.jpg", "f_auto,q_auto,w_1600"),
    alt: "Boardroom - Photo 6",
    category: "events",
    title: "Boardroom",
  },
  {
    id: "event-8",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841224/Boardroom_7_btjadb.jpg", "f_auto,q_auto,w_1600"),
    alt: "Boardroom - Photo 7",
    category: "events",
    title: "Boardroom",
  },
  {
    id: "event-9",
    src: cld("https://res.cloudinary.com/dyfnobo9r/image/upload/v1773841225/Boardroom_8_kaewnc.jpg", "f_auto,q_auto,w_1600"),
    alt: "Boardroom - Photo 8",
    category: "events",
    title: "Boardroom",
  },

  // Facilities Category
  {
    id: "facility-1",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014497/IMG_2954_y59iig.jpg",
    alt: "Swimming Pool",
    category: "facilities",
    title: "Swimming Pool",
  },

  // Exterior Category
  {
    id: "exterior-1",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756012069/images_11_zaumgq.jpg",
    alt: "Hotel Exterior",
    category: "exterior",
    title: "Hotel Exterior",
  },
];

export const galleryCategories = [
  { id: "all", label: "All Photos", count: galleryImages.length },
  {
    id: "rooms",
    label: "Rooms",
    count: galleryImages.filter((img) => img.category === "rooms").length,
  },
  {
    id: "dining",
    label: "Dining",
    count: galleryImages.filter((img) => img.category === "dining").length,
  },
  {
    id: "events",
    label: "Events",
    count: galleryImages.filter((img) => img.category === "events").length,
  },
  {
    id: "facilities",
    label: "Facilities",
    count: galleryImages.filter((img) => img.category === "facilities").length,
  },
  {
    id: "exterior",
    label: "Exterior",
    count: galleryImages.filter((img) => img.category === "exterior").length,
  },
];



