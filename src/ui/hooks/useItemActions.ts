import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Translation } from '../../types/Translation'; 

export const useItemActions = () => {
  const [currentItem, setCurrentItem] = useState<Translation | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (item?: Translation) => () => {
    if (item) {
      setCurrentItem(item);
      setSideOpen(true);
    }
  };

  const handleEdit = (item?: Translation) => () => {
    if (item) navigate(`/edit/${item.prompt_name}`);
  };

  const closeSidePanel = () => setSideOpen(false);

  return {
    currentItem,
    sideOpen,
    handleClick,
    handleEdit,
    closeSidePanel,
  };
};