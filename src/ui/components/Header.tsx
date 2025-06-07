import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Button from './Button';

type FormData = {
  search: string;
};

const Header = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const { promptName } = useParams<{ promptName: string }>();

  const onSubmit = (data: FormData) => {
    navigate(`/search/${data.search}`);
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <h1 className="text-2xl font-bold">
        <Link to="/" className="text-white">Prompt Supporter</Link>
      </h1>
      <div className="flex justify-between items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="mt-2 flex gap-2">
          <input
            {...register('search')}
            type="text"
            className="text-black px-2"
            placeholder="検索ワード"
            defaultValue={promptName ? promptName : ''} // ルートパラメータから初期値を設定
          />
          <Button 
            type="submit"
            text="検索"
          />
        </form>
        <nav>
          <Link to="/create" className="text-white hover:text-gray-300">新規登録</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;