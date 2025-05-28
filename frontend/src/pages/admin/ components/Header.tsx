import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/" className="rounded-1 cursor-pointer">
          <img
            src="/spotivibe.png"
            alt="spotivibe"
            className="w-42 object-cover text-black"
          />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Spotivibe Admin</h1>
          <p className="mt-1 text-zinc-400">
            Manage your music library and stats
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
