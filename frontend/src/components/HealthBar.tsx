import styled from "@emotion/styled";

type Props = {
    health: number;
}
export default function HealthBar({health}: Props) {

    return (
        <StyledHealthBarContainer>
            <StyledHealthBar health={health}/>
            <StyledHealthText health={health}>{health}%</StyledHealthText>
        </StyledHealthBarContainer>
    )
}

const StyledHealthBarContainer = styled.div`
  width: 7rem;
    height: 1.5rem;
    background: var(--color-black);
    border: 2px solid var(--color-black);
    border-radius: 8px;
  position: relative;
`;

const StyledHealthBar = styled.div<{ health: number }>`
  position: absolute;
  top: 0;
    left: 0;
  width: ${({ health }) => health}%;
  height: 100%;
  background: ${({ health }) => health > 50 ? "var(--color-primary)" : "var(--color-secondary)"};
    border-radius: 8px;
  filter: drop-shadow(0 0 2px ${({ health }) => health > 50 ? "var(--color-primary)" : "var(--color-secondary)"});
`;

const StyledHealthText = styled.div<{health: number}>`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  color: ${({health}) => health > 50 ? "black" : "white"};
  text-shadow: 0 0 2px ${({health}) => health > 50 ? "black" : "white"};
`;
