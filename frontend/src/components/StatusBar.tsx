import {StyledStatusBar} from "./styled/StyledStatusBar.ts";
import styled from "@emotion/styled";
import {useStore} from "../hooks/useStore.ts";
import React, {useEffect, useState} from "react";
import {useClickSound} from "../utils/sound.ts";
import {Menu, MenuItem} from "@mui/material";
import {useNavigate} from "react-router-dom";

type Props = {
    gps: boolean;
}

export default function StatusBar({gps}: Props) {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [playerList, setPlayerList] = useState<string[]>([]);
    const activePlayers = useStore(state => state.activePlayers);
    const playClick = useClickSound();
    const navigate = useNavigate();

    useEffect(() => {
        setPlayerList(activePlayers)
    }, [activePlayers]);

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

    return (
        <StyledStatusBar>
            <StyledGpsContainer gps={gps}>
                <p>{gps ? "GPS enabled" : "GPS disabled"}</p>
                {gps && <StyledRotatingTriangle/>}
            </StyledGpsContainer>
            <StyledText onClick={handleOpenUserMenu} count={playerList.length}>
                {playerList.length} Netwalker{playerList.length > 1 && "s"} online
            </StyledText>
                <StyledMenu
                anchorEl={anchorElUser}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                count={activePlayers.length}
            >
                    {playerList.length > 0 && playerList.map((player) => {
                        return <MenuItem key={player} onClick={() => handleNavigate(`/player/${player}`)}>{player}</MenuItem>
                    })}
                </StyledMenu>
        </StyledStatusBar>
    )
}

const StyledGpsContainer = styled.div<{gps: boolean}>`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  
  p {
    font-size: 1rem;
    color: ${({gps}) => gps ? "var(--color-primary)" : "var(--color-secondary)"};
    transition: color 0.5s ease-in-out;
  }
`;

const StyledRotatingTriangle = styled.div`
  width: 0;
  height: 0;
  border: 0.4rem solid transparent;
  border-top: 0;
  border-bottom: 0.65rem solid var(--color-primary);
  color: var(--color-primary);
  position: absolute;
  top: 50%;
  left: 6.5rem;
  transform: translate(-50%, -20%);
  animation: rotate 4s ease-in-out infinite;

  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    50% {
      transform: translate(-50%, -50%) rotate(900deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
  }
`;

const StyledMenu = styled(Menu)<{count: number}>`
    .MuiPaper-root {
      background: var(--color-semiblack);
      color: var(--color-primary);
      filter: drop-shadow(0 0 1rem var(--color-black));
    }
`;

const StyledText = styled.p<{count: number}>`
    color: ${({count}) => count > 0 ? "var(--color-primary)" : "var(--color-secondary)"};
`;
