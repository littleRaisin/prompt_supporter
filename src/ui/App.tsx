import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResult from './pages/SearchResult';
import Edit from './pages/Edit';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="p-4">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search/:danbooruName' element={<SearchResult />} />
          <Route path='/edit/:danbooruName' element={<Edit />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App