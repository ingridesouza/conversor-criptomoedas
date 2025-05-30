export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring ${className}`}
      {...props}
    />
  );
}
