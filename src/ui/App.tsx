import { HashRouter, Routes, Route } from 'react-router-dom';
import '../i18n/i18n';
import Home from './pages/Home';
import SearchResult from './pages/SearchResult';
import Edit from './pages/Edit';
import FavoriteCategoryList from './pages/FavoriteCategoryList';
import Layout from './components/Layout';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/search/:promptName' element={<SearchResult />} />
          <Route path='/create' element={<Edit />} /> 
          <Route path='/edit/:promptName' element={<Edit />} />
          <Route path='/favorite/:category' element={<FavoriteCategoryList />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App
