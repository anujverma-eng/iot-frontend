interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export default function Input({ label, ...rest }: Props) {
  return (
    <label className="block mb-4 text-sm">
      <span className="text-surface-600">{label}</span>
      <input
        {...rest}
        className="mt-1 w-full rounded-lg border border-surface-300 focus:border-brand-600 focus:ring-brand-600 px-3 py-2 text-sm outline-none"
      />
    </label>
  );
}
