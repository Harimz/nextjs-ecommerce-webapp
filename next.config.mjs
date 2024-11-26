/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone",
  images: {
    domains: ["nextjs-ecommerce.s3.us-west-2.amazonaws.com"], // Add your S3 bucket domain here
  },
};

export default nextConfig;
