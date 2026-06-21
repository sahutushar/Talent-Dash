import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl font-bold text-[#EBEBEB] mb-4">404</p>
        <h1 className="text-2xl font-bold text-[#222222] mb-2">Page not found</h1>
        <p className="text-[#717171] mb-6">This page doesn&apos;t exist or has been moved.</p>
        <Link href="/" className="inline-flex items-center px-5 py-2.5 bg-[#FF5A5F] text-white font-medium rounded-xl hover:bg-[#e84f54]">
          Go Home
        </Link>
      </div>
    </div>
  );
}
