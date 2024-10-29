import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "firebasestorage.googleapis.com",
				pathname: "/**",
			},
		],
	},
	eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
