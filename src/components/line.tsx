
export function Line({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full p-2 border border-gray-100 rounded hover:bg-gray-100">
      {children}
    </div>
  );
}
