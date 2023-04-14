import {
  MdList,
  MdOutlineInsertChartOutlined,
  MdReplay,
  MdShoppingCart,
} from "react-icons/md";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Sidebar() {
  const { data: session } = useSession({ required: true });

  return (
    <nav className="w-24 h-screen flex flex-col bg-white items-center py-9 justify-between fixed top-0 left-0">
      {session?.user?.image ? (
        <img className="w-10 h-10 rounded-full" src={session.user.image} alt={session.user.name!} />
      ) : (
        <div className="w-10 h-10 bg-red-600 rounded-full"></div>
      )}

      <ol className="flex flex-col gap-10">
        <li>
          <Link href="/">
            <MdList className="text-xl" />
          </Link>
        </li>
        <li>
          <Link href="/history">
            <MdReplay className="text-xl" />
          </Link>
        </li>
        <li>
          <Link href="/stats">
            <MdOutlineInsertChartOutlined className="text-xl" />
          </Link>
        </li>
      </ol>

      <div className="w-10 h-10 grid place-items-center bg-red-600 rounded-full">
        <MdShoppingCart className="text-xl text-white" />
      </div>
    </nav>
  );
}
