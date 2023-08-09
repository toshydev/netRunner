import {Button} from "@mui/material";
import {useNavigate} from "react-router-dom";
import NavigationIcon from "./icons/NavigationIcon.tsx";
import ListIcon from "./icons/ListIcon.tsx";
import styled from "@emotion/styled";

type Props = {
    view: string;
}

export default function ViewChangeButton({view}: Props) {
    const navigate = useNavigate();

    return <StyledViewButton onClick={() => navigate(view === "map" ? "/map" : "/")}>
        {view === "map" ? <NavigationIcon/> : <ListIcon/>}
    </StyledViewButton>
}

const StyledViewButton = styled(Button)`
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: var(--color-black);
    border: 3px solid var(--color-primary);
    font-family: inherit;
    color: var(--color-primary);
    position: fixed;
    bottom: 4rem;
    left: 2rem;
    filter: drop-shadow(0 0 0.75rem var(--color-black));
    z-index: 9;
  
    &:hover {
        background: var(--color-black);
    }
  
    svg {
        width: 2rem;
        height: 2rem;
    }
`;
