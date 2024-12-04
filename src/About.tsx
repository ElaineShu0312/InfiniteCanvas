const About = () => {
    return (
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 h-full bg-gray-800 text-white p-4">
          <ul>
            <li><a href="#section1" className="block py-2">Introduction</a></li>
            <li><a href="#section2" className="block py-2">Features</a></li>
            <li><a href="#section3" className="block py-2">How It Works</a></li>
          </ul>
        </div>
  
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          <h1 className="text-4xl font-bold text-center mb-8">ArtIfact</h1>
  
          {/* Section 1 */}
          <div id="section1" className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Our Project</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
              ac eros in libero viverra iaculis at at lorem.
            </p>
          </div>
  
          {/* Section 2 */}
          <div id="section2" className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Dev Log</h3>
            <p>
              Curabitur luctus nulla nec metus dictum, id vehicula elit mollis.
              Nulla facilisi. Cras scelerisque erat ut nisl vehicula, et consequat
              purus venenatis.
            </p>
          </div>
  
          {/* Section 3 */}
          <div id="section3" className="mb-8">
            <h3 className="text-2xl font-semibold mb-2">Contributors</h3>
            <p>
              Phasellus in ligula eget justo condimentum tincidunt ut id dui. Nulla
              euismod quam vitae justo sollicitudin, sit amet fermentum risus
              tincidunt.
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default About;
  