import MapComponent from "../components/Map"
import '../app/globals.css'; 
import Link from "next/link" 
export default function Home() {
  return (
<div className = "flex h-screen w-screen justify-center items-center m-auto bg-slate-400">
<Link href = "/map" className ="border-blue-400">
  <button className = "text-2xl border-blue-950">Open Map</button>
  </Link>
</div>
  );
}
