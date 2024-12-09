import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-4">
  

      <ul>
        <li>
          <Link to="#section1" className="block py-2">
            Our Project
          </Link>
        </li>
        <li>
          <Link to="#section2" className="block py-2">
            Dev Log
          </Link>
        </li>
        <li>
          <Link to="#section3" className="block py-2">
            Contributors
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
