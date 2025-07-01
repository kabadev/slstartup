import Image from "next/image";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* Image Column */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 md:px-8 lg:px-10">
        {children}
      </div>
      <div className="hidden bg-gray-100 dark:bg-gray-800 md:block">
        <div className="relative h-full w-full">
          <Image
            src="/images/placeholder1.jpg?height=720&width=1280"
            alt="Login background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
