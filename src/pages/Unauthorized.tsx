export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">403 - Unauthorized</h1>
      <p className="mb-6 text-surface-500">You don't have access to this section.</p>
      <a className="btn-primary" href="/">
        Go back
      </a>
    </div>
  );
}
