import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {Button, Tooltip} from "@mui/material";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import click from "../assets/sounds/click.mp3";

export default function AddButton() {
    const navigate = useNavigate();
    const [playClick] = useSound(click);

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
