import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SearchResult from './pages/SearchResult';
import Edit from './pages/Edit';
import FavoriteCategoryList from './pages/FavoriteCategoryList';
import Header from './components/Header';

function App() {
  return (
    <HashRouter>
      <Header />
      <main className="p-4">
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search/:promptName' element={<SearchResult />} />
          <Route path='/create' element={<Edit />} /> 
          <Route path='/edit/:promptName' element={<Edit />} />
          <Route path='/favorite/:category' element={<FavoriteCategoryList />} /> {/* 新しいルートを追加 */}
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App
