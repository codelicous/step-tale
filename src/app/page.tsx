const list = ["a", "b", "c"];

export default function Home() {
  return (
    <main className="flex justify-center">
      <div className="w-1/3 flex gap-1 pt-10">
        {list.map((item) => {
          return <span key={item}>{item}</span>;
        })}
      </div>
    </main>
  );
}
