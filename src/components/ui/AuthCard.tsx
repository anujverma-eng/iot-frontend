export default function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-sm rounded-xl shadow-card2 bg-white p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-brand-600">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
