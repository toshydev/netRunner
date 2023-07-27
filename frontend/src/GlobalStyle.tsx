import {css, Global} from '@emotion/react';

export default function GlobalStyle() {
    return (
        <Global
            styles={css`
              @font-face {
                font-family: '3270';
                src: url('../public/fonts/3270/3270NerdFont-Regular.ttf') format('truetype');
                font-weight: 400;
                font-style: normal;
              }

              :root {
                --color-black: #1e1e1e;
                --color-semiblack: #343a40;
                --color-grey: #868e96;
                --color-primary: #01fae6;
                --color-secondary: #ff004f;
              }

              #root {
                width: 100%;
              }

              html,
              body {
                font-family: '3270', sans-serif;
                background: #1e1e1e;
              }
            `}
        />
    );
}
