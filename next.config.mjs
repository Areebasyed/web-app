/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "careful-bison-943.convex.cloud",
                port: "",
                
            },
        ],
    }
};

export default nextConfig;
