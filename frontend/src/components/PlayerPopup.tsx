import {Player} from "../models.ts";
import {Popup} from "react-leaflet";
import styled from "@emotion/styled";
import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";

type Props = {
    player: Player
}

export default function PlayerPopup({player}: Props) {
    const navigate = useNavigate()

    return <Popup className={"player-popup"}>
        <StyledPlayerName onClick={() => navigate(`/player/${player.name}`)}>{player.name}</StyledPlayerName>
    </Popup>
}

const StyledPlayerName = styled(Button)`
  background: var(--color-black);
  color: var(--color-secondary);
  border: 2px solid currentColor;
  border-radius: 5px;
  font-family: "3270", monospace;
  height: 100%;
  text-transform: unset;
`;
