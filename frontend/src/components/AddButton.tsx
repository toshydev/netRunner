import {useNavigate} from "react-router-dom";
import styled from "@emotion/styled";
import {Button, Tooltip} from "@mui/material";

export default function AddButton() {
    const navigate = useNavigate();

    return (
        <Tooltip title={"Add Node"} placement={"left"}>
            <StyledAddButton onClick={() => navigate("/add")}>+</StyledAddButton>
        </Tooltip>
    )
}


const StyledAddButton = styled(Button)`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--color-semiblack);
  border: 3px solid var(--color-primary);
  font-family: inherit;
  color: var(--color-primary);
  position: fixed;
  bottom: 2rem;
  right: 2rem;
`;
