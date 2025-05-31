import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from './Button';

type FormData = {
  search: string;
};

const Header = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const { danbooruName } = useParams<{ danbooruName: string }>();

  const onSubmit = (data: FormData) => {
    navigate(`/search/${data.search}`);
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
          defaultValue={danbooruName ? danbooruName : ''} // ルートパラメータから初期値を設定
        />
        <Button 
          type="submit"
          text="検索"
        />
      </form>
    </header>
  );
};

export default Header;