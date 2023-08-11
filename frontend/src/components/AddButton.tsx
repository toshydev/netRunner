import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {Button, Tooltip} from "@mui/material";
import {useClickSound} from "../utils/sound.ts";

export default function AddButton() {
    const navigate = useNavigate();

    const playClick = useClickSound();

    return (
        <Tooltip title={
            <StyledBadge>Add Node</StyledBadge>
        } placement={"left"}>
            <StyledAddButton onClick={() => {
                playClick();
                navigate("/add")
            }}>+</StyledAddButton>
        </Tooltip>
    )
}

const StyledBadge = styled.div`
  color: var(--color-primary);
  font-size: 1.5rem;
`;

const StyledAddButton = styled(Button)`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-semiblack);
  border: 3px solid var(--color-primary);
  font-family: inherit;
  font-size: 2rem;
  color: var(--color-primary);
  position: fixed;
  bottom: 3rem;
  right: 2rem;
  filter: drop-shadow(0 0 0.75rem var(--color-black));
  z-index: 5;

  &:hover {
    background: var(--color-black);
  }
`;
