export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col gap-6 items-center justify-center bg-surface-50">
      // Example usage in components
      <h1 className="text-4xl font-heading font-bold">Dashboard</h1>
      <h2 className="text-2xl font-heading text-surface-600 dark:text-surface-400">Sensor Overview</h2>
      <p className="text-base text-surface-700 dark:text-surface-300 leading-relaxed">
        Real-time monitoring of industrial sensors
      </p>
    </div>
  );
}
