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
                {gps && <StyledRotatingTriangle/>}
            </StyledGpsContainer>
        </StyledStatusBar>
    )
}

const StyledGpsContainer = styled.div<{gps: boolean}>`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
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
  left: 35%;
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
