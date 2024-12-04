// Sidebar.tsx
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 text-white p-4">
      <ul>
        <li><Link to="#section1" className="block py-2">Section 1</Link></li>
        <li><Link to="#section2" className="block py-2">Section 2</Link></li>
        <li><Link to="#section3" className="block py-2">Section 3</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
