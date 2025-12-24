export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: "rooms" | "dining" | "events" | "facilities" | "exterior";
  title?: string;
}

export const galleryImages: GalleryImage[] = [
  // Rooms Category
  {
    id: "room-1",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2936_sgngqe.jpg",
    alt: "Standard Room",
    category: "rooms",
    title: "Standard Room",
  },
  {
    id: "room-2",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014487/IMG_2937_idnyhf.jpg",
    alt: "Standard Room Interior",
    category: "rooms",
    title: "Standard Room Interior",
  },
  {
    id: "room-3",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014488/IMG_2938_ahm3zz.jpg",
    alt: "Standard Room View",
    category: "rooms",
    title: "Standard Room View",
  },
  {
    id: "room-4",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014481/IMG_2926_nzrxnh.jpg",
    alt: "Deluxe Room",
    category: "rooms",
    title: "Deluxe Room",
  },
  {
    id: "room-5",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014489/IMG_2942_oawe9y.jpg",
    alt: "Deluxe Room Interior",
    category: "rooms",
    title: "Deluxe Room Interior",
  },
  {
    id: "room-6",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014505/IMG_2947_u6egrt.jpg",
    alt: "Deluxe Room View",
    category: "rooms",
    title: "Deluxe Room View",
  },
  {
    id: "room-7",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014478/IMG_2925_ah7764.jpg",
    alt: "Family Suite",
    category: "rooms",
    title: "Family Suite",
  },
  {
    id: "room-8",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014472/IMG_2921_ces2aj.jpg",
    alt: "Executive Suite",
    category: "rooms",
    title: "Executive Suite",
  },
  {
    id: "room-9",
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014501/IMG_2941_t3rved.jpg",
    alt: "Executive Suite Interior",
    category: "rooms",
    title: "Executive Suite Interior",
  },
  {
    id: "room-10",
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
    src: "https://res.cloudinary.com/dyfnobo9r/image/upload/v1756014498/IMG_2958_dsuafs.jpg",
    alt: "Event Hall",
    category: "events",
    title: "Event Hall",
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


