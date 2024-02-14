/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
            },
            {
                protocol: "https",
                hostname: "lexica-serve-encoded-images.sharif.workers.dev",
            },
        ],
    },
};

export default nextConfig;
