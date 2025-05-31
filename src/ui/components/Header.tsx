import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

type FormData = {
  search: string;
};

const Header = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const navigate = useNavigate();

  const onSubmit = (data: FormData) => {
    navigate(`/search/${data.search}`);
    reset();
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold">
        <Link to="/" className="text-white hover:text-gray-300">Danbooru Trans</Link>
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex gap-2">
        <input
          {...register('search')}
          type="text"
          className="text-black px-2"
          placeholder="検索ワード"
        />
        <button type="submit" className="bg-blue-500 px-3 py-1 rounded">Search</button>
      </form>
    </header>
  );
};

export default Header;