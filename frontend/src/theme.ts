import {createTheme} from "@mui/material";
import NerdFont from "./assets/fonts/3270/3270NerdFont-Regular.ttf";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#343a40",
            light: "#868e96",
            dark: "#1e1e1e"
        },
        error: {
            main: "#ff004f",
        },
        success: {
            main: "#01fae6",
        }
    },
    typography: {
        fontFamily: "3270"
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
                @font-face {
                    font-family: "3270";
                    src: url(${NerdFont});
                    `,
        }
    }
})