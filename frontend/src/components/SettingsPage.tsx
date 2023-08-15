import {Card} from "@mui/material";
import styled from "@emotion/styled";
import VolumeBar from "./VolumeBar.tsx";

export default function SettingsPage() {
    return <StyledCard>
        <StyledHeading>Sound</StyledHeading>
        <VolumeBar/>
    </StyledCard>
}

const StyledCard = styled(Card)`
  margin: 0.5rem 0;
  width: 95%;
  height: 70vh;
  background: var(--color-semiblack);
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
`;

const StyledHeading = styled.h2`
    color: var(--color-primary);
`;
