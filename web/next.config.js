// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {

    output: 'standalone',
    async rewrites() {
        return [
            {
                source: '/api/:path*',

                destination: 'http://app:8080/:path*',
            },
        ];
    },

    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'app',
                port: '8080',
                pathname: '/**',
            },

        ],
    },
};

module.exports = nextConfig;
