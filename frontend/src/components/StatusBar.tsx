import {StyledStatusBar} from "./styled/StyledStatusBar.ts";
import styled from "@emotion/styled";

type Props = {
    gps: boolean;
}

export default function StatusBar({gps}: Props) {

    return (
        <StyledStatusBar>
            <StyledGpsContainer gps={gps}>
                <p>{gps ? "GPS enabled" : "GPS disabled"}</p>
            </StyledGpsContainer>
        </StyledStatusBar>
    )
}

const StyledGpsContainer = styled.div<{gps: boolean}>`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 1rem;
  
  p {
    font-size: 1rem;
    color: ${({gps}) => gps ? "var(--color-primary)" : "var(--color-secondary)"};
  }
`;
