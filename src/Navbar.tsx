import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">
        <h2>About</h2>
      </Link>
      <Link to="/canvas">
        <h2>Canvas</h2>
      </Link>
    </nav>
  );
};

export default Navbar;
