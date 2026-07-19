export default function Spinner({ className = 'h-8 w-8' }) {
  return (
    <div className={`animate-spin rounded-full border-4 border-primary-600 border-t-transparent ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner />
    </div>
  );
}
