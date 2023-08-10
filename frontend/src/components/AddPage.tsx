import {useState} from "react";
import {useStore} from "../hooks/useStore.ts";
import {Coordinates, NodeData} from "../models.ts";
import {useNavigate} from "react-router-dom";
import {StyledForm} from "./styled/StyledForm.ts";
import {StyledLabel} from "./styled/StyledLabel.ts";
import {StyledInput} from "./styled/StyledInput.ts";
import {StyledHelperContainer} from "./styled/StyledHelperContainer.ts";
import {StyledHelperText} from "./styled/StyledHelperText.ts";
import {StyledButtonContainer} from "./styled/StyledButtonContainer.ts";
import {StyledFormButton} from "./styled/StyledFormButton.ts";
import {Switch} from "@mui/material";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import click from "../assets/sounds/click.mp3";
import loginSuccess from "../assets/sounds/login_success.mp3";
import keyPress from "../assets/sounds/key_press.mp3";
import switchButton from "../assets/sounds/switch.mp3";
import error from "../assets/sounds/error.mp3";

export default function AddPage() {
    const [name, setName] = useState<string>("");
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [nameError, setNameError] = useState<string>("Name cannot be empty");
    const [latitudeError, setLatitudeError] = useState<string>("");
    const [longitudeError, setLongitudeError] = useState<string>("");
    const [playClick] = useSound(click);
    const [playLoginSuccess] = useSound(loginSuccess);
    const [playError] = useSound(error);
    const [playKeyPress] = useSound(keyPress);
    const [playSwitch] = useSound(switchButton);

    const player = useStore(state => state.player);
    const addNode = useStore(state => state.addNode);
    const navigate = useNavigate();
    const submitActive = nameError === "" && latitudeError === "" && longitudeError === "";
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const timestamp = Date.now();
        const coordinates: Coordinates = {latitude, longitude, timestamp}
        const nodeData: NodeData = {name, coordinates};
        addNode(nodeData, playLoginSuccess, playError);
        navigate("/");
    }

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        playKeyPress()
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
        playKeyPress()
        setLatitude(Number(event.target.value));
        if (Number(event.target.value) < -90 || Number(event.target.value) > 90) {
            setLatitudeError("Latitude must be between -90 and 90");
        } else {
            setLatitudeError("");
        }
    }

    function handleLongitudeChange(event: React.ChangeEvent<HTMLInputElement>) {
        playKeyPress()
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
            <StyledHelperContainer>
                <StyledHelperText>{nameError}</StyledHelperText>
            </StyledHelperContainer>
            <StyledLabel htmlFor="latitude">Latitude</StyledLabel>
            <StyledInput id="latitude" type="number" value={latitude} onChange={handleLatitudeChange}
                         placeholder="Latitude"/>
            <StyledHelperContainer>
                <StyledHelperText>{latitudeError}</StyledHelperText>
            </StyledHelperContainer>
            <StyledLabel htmlFor="longitude">Longitude</StyledLabel>
            <StyledInput id="longitude" type="number" value={longitude} onChange={handleLongitudeChange}
                         placeholder="Longitude"/>
            <StyledHelperContainer>
                <StyledHelperText>{longitudeError}</StyledHelperText>
            </StyledHelperContainer>
            {player && <StyledLabel htmlFor={"player"}>Use player position<Switch
                id="player"
                defaultChecked={false}
                onChange={() => {
                    playSwitch()
                    setLatitude(player.coordinates.latitude)
                    setLongitude(player.coordinates.longitude)
                }}
                color={"success"}
            /></StyledLabel>}
            <StyledButtonContainer>
                <StyledFormButton theme="error" onClick={() => {
                    playClick();
                    navigate("/")
                }}>Cancel</StyledFormButton>
                <StyledFormButton theme="success" type="submit"
                                     disabled={!submitActive}>Add</StyledFormButton>
            </StyledButtonContainer>
        </StyledForm>
    )
}
