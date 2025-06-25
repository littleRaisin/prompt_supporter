import type { Preview } from '@storybook/react-vite';
import '../src/ui/index.css'; // TailwindCSSのベーススタイルをインポート

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
