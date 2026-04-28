import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'apod.nasa.gov' },
      { protocol: 'https', hostname: 'www.nasa.gov' },
      { protocol: 'https', hostname: 'images2.imgbox.com' },
      { protocol: 'https', hostname: 'i.imgur.com' }
    ]
  }
};

export default withNextIntl(nextConfig);
