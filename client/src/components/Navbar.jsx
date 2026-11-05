import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <h1 className="text-2xl font-bold">
          EventHub
        </h1>

        <div className="flex gap-6">

          <Link
            to="/"
            className="transition hover:text-indigo-400"
          >
            Home
          </Link>

          <Link
            to="/events"
            className="transition hover:text-indigo-400"
          >
            Events
          </Link>

          <Link
            to="/login"
            className="transition hover:text-indigo-400"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="transition hover:text-indigo-400"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
