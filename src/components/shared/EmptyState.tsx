import Image from "next/image";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No Online Test Available",
  description = "Currently, there are no online tests available. Please check back later for updates.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative mb-6 h-24 w-24">
        <Image
          src="/Group.png"
          alt="No data"
          fill
          className="object-contain"
        />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="max-w-md text-center text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
