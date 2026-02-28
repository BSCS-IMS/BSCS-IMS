import Link from "next/link"

export default function RootPage() {
  return <>
    <Link className="text-center text-8xl" href={'/login'}>Go to login</Link>
  </>
}
