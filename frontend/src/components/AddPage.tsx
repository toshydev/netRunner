import {useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import {Coordinates, NodeData} from "../models.ts";
import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import styled from "@emotion/styled";

export default function AddPage() {
    const [name, setName] = useState<string>("");
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [nameError, setNameError] = useState<string>("");
    const [latitudeError, setLatitudeError] = useState<string>("");
    const [longitudeError, setLongitudeError] = useState<string>("");

    const addNode = useStore(state => state.addNode);
    const navigate = useNavigate();

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const timestamp = Date.now();
        const coordinates: Coordinates = {latitude, longitude, timestamp}
        const nodeData: NodeData = {name, coordinates};
        addNode(nodeData);
        navigate("/");
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setName(event.target.value);
        if (event.target.value === "") {
            setNameError("Name cannot be empty");
        } else if (event.target.value.length > 15) {
            setNameError("Name cannot be longer than 15 characters");
        } else {
            setNameError("");
        }
    }

    function handleLatitudeChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLatitude(Number(event.target.value));
        if (Number(event.target.value) < -90 || Number(event.target.value) > 90) {
            setLatitudeError("Latitude must be between -90 and 90");
        } else {
            setLatitudeError("");
        }
    }

    function handleLongitudeChange(event: React.ChangeEvent<HTMLInputElement>) {
        setLongitude(Number(event.target.value));
        if (Number(event.target.value) < -180 || Number(event.target.value) > 180) {
            setLongitudeError("Longitude must be between -180 and 180");
        } else {
            setLongitudeError("");
        }
    }

    return (
        <StyledForm onSubmit={handleSubmit}>
            <StyledLabel htmlFor="name">Name</StyledLabel>
            <StyledInput id="name" type="text" value={name} onChange={handleNameChange} placeholder="New Node 1"/>
            <StyledLabel htmlFor="latitude">Latitude</StyledLabel>
            <StyledInput id="latitude" type="number" value={latitude} onChange={handleLatitudeChange}
                         placeholder="Latitude"/>
            <StyledLabel htmlFor="longitude">Longitude</StyledLabel>
            <StyledInput id="longitude" type="number" value={longitude} onChange={handleLongitudeChange}
                         placeholder="Longitude"/>
            <StyledButtonContainer>
                <StyledCancelButton onClick={() => navigate("/")}>Cancel</StyledCancelButton>
                <StyledSuccessButton type="submit"
                                     disabled={nameError.length + latitudeError.length + longitudeError.length < 1}>Add</StyledSuccessButton>
            </StyledButtonContainer>
        </StyledForm>

    )

}

const StyledForm = styled.form`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
`;

const StyledLabel = styled.label`
  color: var(--color-primary);
`;

const StyledInput = styled.input`
  background: var(--color-semiblack);
  outline: 2px solid var(--color-primary);
  color: var(--color-primary);
  font: inherit;
  width: 100%;
  height: 3rem;
  margin-bottom: 1rem;

  &::placeholder {
    color: var(--color-primary);
  }
`;

const StyledButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 1rem;
  width: 100%;
  gap: 0.25rem;
`;

const StyledCancelButton = styled(Button)`
  background: var(--color-semiblack);
  border: 4px solid var(--color-secondary);
  border-radius: 12px;
  color: var(--color-secondary);
  font: inherit;
  width: 45%;
`;

const StyledSuccessButton = styled(Button)`
  background: var(--color-semiblack);
  border: 4px solid var(--color-primary);
  border-radius: 12px;
  color: var(--color-primary);
  font: inherit;
  width: 45%;
`;
