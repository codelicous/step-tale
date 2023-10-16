//TODO: update types
export function Form(props: any) {
    "use server";
  return (
    <form action={props.action} className="flex w-full">
      <input
        id="text"
        name="text"
        autoFocus={true}
        placeholder="Type here..."
        className="w-full p-2 border border-gray-400 rounded rounded-r-none border-r-0  outline-none"
      />
      <button
        type="submit"
        className="p-2 border border-gray-400  bg-blue-100 rounded rounded-l-none"
      >
        add
      </button>
    </form>
  );
}
