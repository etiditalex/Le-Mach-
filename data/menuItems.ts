import { MenuItem } from "@/context/CartContext";

export const menuItems: MenuItem[] = [
  // Breakfast
  {
    id: "breakfast-1",
    name: "Continental Breakfast",
    description: "Fresh pastries, butter, jam, and your choice of coffee or tea",
    price: 1200,
    image: "https://images.unsplash.com/photo-1494859802809-d069c3b71a8a?w=400&h=300&fit=crop",
    category: "breakfast",
  },
  {
    id: "breakfast-2",
    name: "Full English Breakfast",
    description: "Eggs, bacon, sausages, baked beans, mushrooms, and toast",
    price: 1800,
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
    category: "breakfast",
  },
  // Lunch
  {
    id: "lunch-1",
    name: "Grilled Chicken Salad",
    description: "Fresh mixed greens with grilled chicken, cherry tomatoes, and balsamic dressing",
    price: 1500,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    category: "lunch",
  },
  {
    id: "lunch-2",
    name: "Classic Beef Burger",
    description: "Juicy beef patty with lettuce, tomato, cheese, and special sauce",
    price: 1300,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    category: "lunch",
  },
  {
    id: "lunch-3",
    name: "Pilau Rice",
    description: "Fragrant spiced rice with tender meat and aromatic spices",
    price: 1600,
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
    category: "lunch",
  },
  // Dinner
  {
    id: "dinner-1",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet with seasonal vegetables and lemon butter sauce",
    price: 2500,
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72719488?w=400&h=300&fit=crop",
    category: "dinner",
  },
  {
    id: "dinner-2",
    name: "Beef Tenderloin",
    description: "Premium beef tenderloin with roasted potatoes and red wine reduction",
    price: 3200,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
    category: "dinner",
  },
  {
    id: "dinner-3",
    name: "Nyama Choma",
    description: "Traditional Kenyan grilled meat served with ugali and kachumbari",
    price: 2800,
    image: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&h=300&fit=crop",
    category: "dinner",
  },
  // Desserts
  {
    id: "dessert-1",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 800,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    category: "desserts",
  },
  {
    id: "dessert-2",
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
    price: 900,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop",
    category: "desserts",
  },
  // Beverages
  {
    id: "beverage-1",
    name: "Fresh Fruit Juice",
    description: "Selection of fresh seasonal fruit juices - mango, passion fruit, or orange",
    price: 400,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=300&fit=crop",
    category: "beverages",
  },
  {
    id: "beverage-2",
    name: "Premium Coffee",
    description: "Freshly brewed coffee from local Kenyan beans",
    price: 300,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    category: "beverages",
  },
];

