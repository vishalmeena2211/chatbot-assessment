/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns : [
            {
                hostname: 'static.vecteezy.com',
            }
        ]
        
    }
};

export default nextConfig;
