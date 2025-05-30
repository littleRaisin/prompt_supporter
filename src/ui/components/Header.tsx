const Header = () => { 
  return (
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold">Danbooru Trans</h1>
      <nav className="mt-2">
        <a href="/" className="text-white hover:text-gray-300 mr-4">Home</a>
        <a href="/search" className="text-white hover:text-gray-300 mr-4">Search</a>
        <a href="/edit" className="text-white hover:text-gray-300">Edit</a>
      </nav>
    </header>
  );
};

export default Header;
