export default function CurrentGamePage(props: { params: { slug: string } }) {
  console.log(props);
  return (
    <div>
      <h1>Current Game id: {props.params.slug}</h1>
    </div>
  );
}
