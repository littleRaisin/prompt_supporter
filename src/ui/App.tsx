import { HashRouter, Routes, Route } from 'react-router-dom';
import './../i18n/i18n';
import Home from './pages/Home';
import SearchResult from './pages/SearchResult';
import Edit from './pages/Edit';
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
        </Routes>
      </main>
    </HashRouter>
  );
}

export default App
