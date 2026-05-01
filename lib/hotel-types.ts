export type PaymentProvider = "mpesa";

export type PaymentStatus =
  | "awaiting_payment"
  | "processing_mpesa"
  | "paid"
  | "failed"
  | "cancelled";

export type MenuItemRecord = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export type RoomRecord = {
  id: string;
  name: string;
  pricePerNight: number;
  image: string;
  description?: string;
};

/** Bar & Restaurant alcohol / spirits listing (public + admin). */
export type BarBrandRecord = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sortOrder: number;
};

export type OrderLine = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type FoodOrder = {
  id: string;
  type: "food";
  status: PaymentStatus;
  lines: OrderLine[];
  totalKes: number;
  roomNumber: string | null;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  receiptKey: string;
  createdAt: string;
  paidAt?: string;
  paymentProvider?: PaymentProvider;
  mpesa?: {
    checkoutRequestId?: string;
    merchantRequestId?: string;
    receiptNumber?: string;
    phone?: string;
  };
  lastError?: string;
};

export type BookingRecord = {
  id: string;
  type: "booking";
  status: PaymentStatus;
  roomId: string;
  roomName: string;
  pricePerNight: number;
  nights: number;
  totalKes: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  receiptKey: string;
  createdAt: string;
  paidAt?: string;
  paymentProvider?: PaymentProvider;
  mpesa?: FoodOrder["mpesa"];
  lastError?: string;
};

export type AdminNotification = {
  id: string;
  kind: "food_paid" | "booking_paid";
  title: string;
  body: string;
  entityId: string;
  read: boolean;
  createdAt: string;
};

export type HotelStore = {
  menuItems: MenuItemRecord[];
  rooms: RoomRecord[];
  foodOrders: FoodOrder[];
  bookings: BookingRecord[];
  notifications: AdminNotification[];
};
