//TODO: add label
export function Input() {
  "use server";
  return (
    <input
      autoFocus={true}
      placeholder="Type here..."
      className="w-full p-2 border border-gray-400 rounded"
    />
  );
}
