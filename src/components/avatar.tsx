import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

export function Avatar({ src }: { src: string | StaticImport }) {
  return (
    <Image
      width={40}
      height={40}
      src={src}
      alt="avatar"
      className="w-10 h-10 rounded-full"
    />
  );
}
