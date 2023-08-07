import {Avatar, Card, Typography, useTheme} from "@mui/material";
import styled from "@emotion/styled";
import usePlayer from "../hooks/usePlayer.ts";
import {StyledButtonContainer} from "./styled/StyledButtonContainer.ts";
import {StyledFormButton} from "./styled/StyledFormButton.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import AvatarImage from "../assets/images/avatar.png";
import NodeList from "./NodeList.tsx";
import useNodes from "../hooks/useNodes.ts";

export default function PlayerPage() {
    const [name, setName] = useState<string>("")
    const [id, setId] = useState<string>("")
    const params = useParams()
    const navigate = useNavigate()
    const player = usePlayer(name)
    const nodes = useNodes(id)
    const user = useStore(state => state.user)
    const logout = useStore(state => state.logout)
    const theme = useTheme()

    const isEnemy = user !== player?.name

    useEffect(() => {
        if (params.name) {
            setName(params.name)
        }
        if (player) {
            setId(player.id)
        }
    }, [params.name, player]);

    if (typeof player !== "undefined") {
        return (
            <>
            <StyledCard>
                <StyledAvatar isEnemy={`${isEnemy}`} src={`${AvatarImage}`} sx={{width: 125, height: 125}}/>
                <StyledPlayerDetails>
                    <StyledText>Name: {player.name}</StyledText>
                    <StyledText>Health: {player.health}/{player.maxHealth}HP</StyledText>
                    <StyledText>Level: {player.level}</StyledText>
                    <StyledText>Experience: {player.experience}/{player.experienceToNextLevel}XP</StyledText>
                </StyledPlayerDetails>
                <StyledPlayerStats>
                    <StyledText>Credits: {player.credits}$</StyledText>
                    <StyledText color={"secondary"}>Attack: {player.attack}AP</StyledText>
                </StyledPlayerStats>
                <StyledPlayerCoordinates>
                    <StyledText>Position:</StyledText>
                    <StyledText>Lat: {player.coordinates.latitude}</StyledText>
                    <StyledText>Lon: {player.coordinates.longitude}</StyledText>
                </StyledPlayerCoordinates>
            </StyledCard>
                <Typography color={theme.palette.success.main} variant={"h5"}>Nodes</Typography>
                <StyledButtonContainer>
                    <StyledFormButton theme={"primary"} onClick={() => navigate("/")}>Nodelist</StyledFormButton>
                    <StyledFormButton theme={"error"} onClick={() => logout(navigate)}>Logout</StyledFormButton>
                </StyledButtonContainer>
                {nodes && <NodeList player={player} nodes={nodes}/>}
        </>
        )
    }
}

const StyledCard = styled(Card)`
  margin: 1rem 0;
  width: 95%;
  height: 50vh;
  background: var(--color-semiblack);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2fr 1fr 2fr;
`;

const StyledAvatar = styled(Avatar)<{isEnemy: string}>`
  grid-row: 1;
  grid-column: 1;
  display: flex;
  margin: auto;
  border: 2px solid ${props => props.isEnemy === "true" ? "var(--color-secondary)" : "var(--color-primary)"};
  filter: drop-shadow(0 0 0.15rem ${props => props.isEnemy === "true" ? "var(--color-secondary)" : "var(--color-primary)"});
`;

const StyledPlayerDetails = styled.div`
    grid-row: 1;
    grid-column: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const StyledPlayerStats = styled.div`
  grid-row: 2;
  grid-column: 1 / span 2;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-left: 2rem;
`;

const StyledPlayerCoordinates = styled.div`
  grid-row: 3;
  grid-column: 1 / span 2;
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
`;

const StyledText = styled(Typography)<{color?: string}>`
    color: ${props => props.color === "secondary" ? "var(--color-secondary)" : "var(--color-primary)"};
    font-family: inherit;
`;
