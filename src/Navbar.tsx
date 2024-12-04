import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav>
      <Link to="/">
        <p>About</p>
      </Link>
      <Link to="/canvas">
        <p>Canvas</p>
      </Link>
    </nav>
  );
};

export default Navbar;
