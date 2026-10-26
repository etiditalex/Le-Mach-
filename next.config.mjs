/** @type {import('next').NextConfig} */
const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
  },
  {
    protocol: 'https',
    hostname: 'res.cloudinary.com',
  },
  {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com',
  },
  {
    protocol: 'https',
    hostname: 'maps.gstatic.com',
  },
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  try {
    const u = new URL(supabaseUrl);
    if (u.hostname) {
      remotePatterns.push({
        protocol: 'https',
        hostname: u.hostname,
      });
    }
  } catch {
    // ignore invalid URL
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
