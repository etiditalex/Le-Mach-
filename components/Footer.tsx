import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold mb-4">Lemach Hotel</h3>
            <p className="text-gray-400 mb-4">
              Your perfect destination for luxury accommodation, dining, and events in Kilifi County.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/rooms" className="text-gray-400 hover:text-primary transition-colors">
                  Rooms
                </Link>
              </li>
              <li>
                <Link href="/meetings-events" className="text-gray-400 hover:text-primary transition-colors">
                  Meetings & Events
                </Link>
              </li>
              <li>
                <Link href="/menu" className="text-gray-400 hover:text-primary transition-colors">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-primary transition-colors">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/bar-restaurant" className="text-gray-400 hover:text-primary transition-colors">
                  Bar & Restaurant
                </Link>
              </li>
              <li>
                <Link href="/meetings-events" className="text-gray-400 hover:text-primary transition-colors">
                  Conference Room
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Swimming Pool
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  Activities
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>B69, Kilifi County, Kenya</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span>+254 721 929446</span>
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span>lemachstudios@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400">
            <p>&copy; 2024 Lemach Hotel & Accommodations. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

