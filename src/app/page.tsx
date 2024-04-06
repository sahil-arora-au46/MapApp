import '../app/globals.css';
import Link from "next/link";
import { ReactElement } from "react";

export default function Home(): ReactElement {
  return (
    <div className="flex h-screen w-screen justify-center items-center m-auto bg-slate-400">
      {/* Use the Link component to navigate to the /map route */}
      <Link href="/map">
        <button className="text-2xl border-blue-950">Open Map</button>
      </Link>
    </div>
  );
}