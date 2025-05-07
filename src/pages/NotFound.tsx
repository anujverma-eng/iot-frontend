export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-3">404</h1>
      <p className="mb-6 text-surface-500">Page not found</p>
      <a href="/" className="btn-primary">Go home</a>
    </div>
  );
}
