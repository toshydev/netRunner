import {css, Global} from '@emotion/react';
import NerdFont from './assets/fonts/3270/3270NerdFont-Regular.ttf';
import Cyberpunk from './assets/fonts/Cyberpunk/Cyberpunk.ttf';

export default function GlobalStyle() {
    return (
        <Global
            styles={css`
              @font-face {
                font-family: '3270';
                src: url('${NerdFont}') format('truetype');
                font-weight: 400;
                font-style: normal;
              }

              @font-face {
                font-family: 'Cyberpunk';
                src: url('${Cyberpunk}') format('truetype');
                font-weight: 400;
                font-style: normal;
              }

              :root {
                --color-black: #1e1e1e;
                --color-semiblack: #343a40;
                --color-grey: #868e96;
                --color-primary: #01fae6;
                --color-secondary: #ff004f;
                
                --font-play: 'Play', sans-serif;
                --font-3270: '3270', monospace, sans-serif;
                --font-cyberpunk: 'Cyberpunk', monospace, sans-serif;
              }

              html,
              body {
                font-family: var(--font-play);
                background: #1e1e1e;
              }
            `}
        />
    );
}
