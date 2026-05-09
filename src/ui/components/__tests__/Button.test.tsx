import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';
import userEvent from '@testing-library/user-event';

describe('Button', () => {
  it('ボタンのテキストが正しく表示されること', () => {
    render(<Button text="テストボタン" />);
    expect(screen.getByText('テストボタン')).toBeInTheDocument();
  });

  it('クリックハンドラが正しく呼び出されること', async () => {
    const handleClick = vi.fn();
    render(<Button text="クリックミー" onClick={handleClick} />);
    
    const button = screen.getByText('クリックミー');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('デフォルトのtypeがbuttonであること', () => {
    render(<Button text="デフォルトタイプ" />);
    const button = screen.getByText('デフォルトタイプ');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('指定されたtypeが正しく適用されること', () => {
    render(<Button text="サブミット" type="submit" />);
    const button = screen.getByText('サブミット');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('disabledがtrueの場合、ボタンがクリックできないこと', async () => {
    const handleClick = vi.fn();
    render(<Button text="無効ボタン" onClick={handleClick} disabled />);

    const button = screen.getByText('無効ボタン');
    await userEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('danger variantで赤背景のスタイルが適用されること', () => {
    render(<Button text="削除" variant="danger" />);
    const button = screen.getByText('削除');
    expect(button.className).toContain('bg-red-500');
  });

  it('secondary variantでグレー背景のスタイルが適用されること', () => {
    render(<Button text="キャンセル" variant="secondary" />);
    const button = screen.getByText('キャンセル');
    expect(button.className).toContain('bg-gray-300');
  });
});
