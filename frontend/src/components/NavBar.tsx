import {AppBar, Avatar, Box, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography} from "@mui/material";
import styled from "@emotion/styled";
import Intelligence from "../assets/images/intelligence.png"
import PlayerAvatar from "../assets/images/defaultAvatar.webp"
import {useLocation, useNavigate} from "react-router-dom";
import React, {useState} from "react";
import {keyframes} from "@emotion/react";
import {useClickSound, useErrorSound, useLoginSuccessSound} from "../utils/sound.ts";
import {useStore} from "../hooks/useStore.ts";

type Props = {
    user?: string
}

export default function NavBar({user}: Props) {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const isAuthenticated = user !== "" && user !== undefined && user !== "anonymousUser"
    const logout = useStore(state => state.logout)
    const navigate = useNavigate()
    const playClick = useClickSound();
    const playError = useErrorSound();
    const playLoginSuccess = useLoginSuccessSound();
    const location = useLocation();

    function getPageName() {
        const page = location.pathname.split("/")[1]
        const subPage = location.pathname.split("/")[2]
        if (page === "") {
            return "Access Points"
        } else if(page === "map") {
            return "Map"
        } else if(page === "login") {
            return "Netrunner"
        } else if(page === "store") {
            return "Daemon Store"
        } else if(page === "settings") {
            return "Settings"
        } else {
            return subPage.charAt(0).toUpperCase() + subPage.slice(1)
        }
    }
    function handleOpenUserMenu(event: React.MouseEvent<HTMLElement>) {
        playClick()
        setAnchorElUser(event.currentTarget);
    }

    function handleCloseUserMenu() {
        playClick()
        setAnchorElUser(null);
    }

    function handleNavigate(path: string) {
        playClick()
        setAnchorElUser(null);
        navigate(path)
    }

    const heading = getPageName()

    return <StyledAppBar position="sticky">
        <Container maxWidth="xl">
            <Toolbar disableGutters>
                <StyledLogo src={Intelligence} alt={"netrunner logo"} onClick={() => {
                    playClick()
                    navigate("/map")
                }}/>
                <StyledHeading length={heading.length}>{heading}</StyledHeading>
                {isAuthenticated && <Box sx={{flexGrow: 0, ml: "auto"}}>
                    <Tooltip title="Open settings">
                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                            <Avatar alt="player avatag" src={PlayerAvatar}/>
                        </IconButton>
                    </Tooltip>
                    <StyledMenu
                        sx={{mt: '45px'}}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem onClick={() => handleNavigate(`/player/${user}`)}>
                            <StyledText textAlign="center">Profile</StyledText>
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/store")}>
                            <StyledText textAlign="center">Store</StyledText>
                        </MenuItem>
                        <MenuItem onClick={() => handleNavigate("/settings")}>
                            <StyledText textAlign="center">Settings</StyledText>
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setAnchorElUser(null);
                            logout(navigate, playLoginSuccess, playError)
                        }}>
                            <StyledText textAlign="center" color="error">Logout</StyledText>
                        </MenuItem>
                    </StyledMenu>
                </Box>}
            </Toolbar>
        </Container>
    </StyledAppBar>
}

const StyledAppBar = styled(AppBar)`
  background: var(--color-black);
  color: var(--color-primary);
  box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.2), 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(255, 0, 79, 0.12);
  z-index: 10;
  border: 2px solid transparent;
  border-bottom-color: var(--color-secondary);
`;

const pulse = keyframes`
    0% {
      filter: hue-rotate(-15deg) drop-shadow(0 0 1rem var(--color-black));
    }
  50% {
    filter: hue-rotate(-15deg) drop-shadow(0 0 0.1rem var(--color-primary));
  }
    100% {
      filter: hue-rotate(-15deg) drop-shadow(0 0 1rem var(--color-black));
    }
`;

const StyledLogo = styled.img`
  width: 3rem;
  height: 3rem;
  animation: ${pulse} 4s infinite;
  transition: scale 0.15s ease-in-out;
  
  &:active {
    scale: 0.95;
  }
`;

const blink = keyframes`
  0% {
    color: var(--color-primary);
  }
  2% {
    color: transparent;
  }
  4% {
    color: var(--color-primary);
  }
  90% {
    color: var(--color-primary);
  }
  92% {
    color: var(--color-secondary);
  }
  94% {
    color: var(--color-primary);
  }
  100% {
    color: var(--color-primary);
  }
`;

const StyledHeading = styled.h1<{length: number}>`
  color: var(--color-primary);
  text-shadow: -1px -1px 1px var(--color-secondary);
  animation: ${blink} 3s infinite;
  filter: drop-shadow(0 0 1rem var(--color-black));
  margin-left: 1rem;
  font-family: var(--font-cyberpunk);
  font-size: ${({length}) => length > 10 ? "1.5rem" : "2rem"};
`;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    background: var(--color-semiblack);
    color: var(--color-primary);
    filter: drop-shadow(0 0 1rem var(--color-black));
  }
`;

const StyledText = styled(Typography)`
  text-shadow: 0 0 0.25rem currentColor;
`;
