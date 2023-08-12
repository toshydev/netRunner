import {StyledForm} from "./styled/StyledForm.ts";
import {ChangeEvent, FormEvent, useState} from "react";
import {StyledLabel} from "./styled/StyledLabel.ts";
import {StyledInput} from "./styled/StyledInput.ts";
import {StyledButtonContainer} from "./styled/StyledButtonContainer.ts";
import {StyledFormButton} from "./styled/StyledFormButton.ts";
import {StyledHelperText} from "./styled/StyledHelperText.ts";
import {StyledHelperContainer} from "./styled/StyledHelperContainer.ts";
import {Switch} from "@mui/material";
import {useStore} from "../hooks/useStore.ts";
import {useNavigate} from "react-router-dom";
import {
    useErrorSound,
    useKeyPressSound,
    useLoadingOsSound,
    useLoginSuccessSound,
    useSwitchSound
} from "../utils/sound.ts";
import VolumeBar from "./VolumeBar.tsx";

export default function LoginPage() {
    const [newUser, setNewUser] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("Username must have at least three characters");
    const [emailError, setEmailError] = useState<string>("Invalid email");
    const [passwordError, setPasswordError] = useState<string>("Password must have at least three characters");

    const playLoginSuccess = useLoginSuccessSound()
    const playError = useErrorSound()
    const playKeyPress = useKeyPressSound()
    const playSwitch = useSwitchSound()
    const playLoadingOs = useLoadingOsSound()

    const login = useStore(state => state.login)
    const register = useStore(state => state.register)
    const navigate = useNavigate()

    const submitActive = usernameError === "" && emailError === "" && passwordError === ""

    function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        register(username, email, password);
        setNewUser(false)
    }

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        login(username, password, navigate, () => {
            playLoginSuccess()
            playLoadingOs()
        }, playError);
    }

    function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
        playKeyPress()
        setUsername(event.target.value);
        if (event.target.value.length < 3) {
            setUsernameError("Username must have at least three characters");
        } else if (event.target.value.length > 15) {
            setUsernameError("Username cannot be longer than 15 characters");
        } else {
            setUsernameError("");
        }
    }

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        playKeyPress()
        setEmail(event.target.value);
        if (!/^\w+@\w+\.\w+$/.exec(event.target.value)) {
            setEmailError("Invalid email");
        } else {
            setEmailError("");
        }
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        playKeyPress()
        setPassword(event.target.value);
        if (event.target.value.length < 3) {
            setPasswordError("Password must have at least three characters");
        } else {
            setPasswordError("");
        }
    }

    function handleNewUserSwitch() {
        setNewUser(!newUser);
    }

    return <>
        <VolumeBar/>
        <StyledForm onSubmit={newUser ? handleRegister : handleLogin}>
            <legend>{newUser ? "Register" : "Login"}</legend>
            <StyledLabel htmlFor={"newUser"}>New User<Switch
                id="newUser"
                checked={newUser}
                onChange={() => {
                    playSwitch()
                    handleNewUserSwitch()
                }}
                color={newUser ? "success" : "error"}
            /></StyledLabel>
            <StyledLabel htmlFor="username">Username</StyledLabel>
            <StyledInput
                required
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={newUser
                    ? handleUsernameChange
                    : (event) => {
                        playKeyPress()
                        setUsername(event.currentTarget.value)
                    }}
            />
            <StyledHelperContainer>
                {newUser && <StyledHelperText>{usernameError}</StyledHelperText>}
            </StyledHelperContainer>
            {newUser && <>
                <StyledLabel htmlFor="email" id="email">Email</StyledLabel>
                <StyledInput
                    required
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={newUser
                        ? handleEmailChange
                        : (event) => {
                            playKeyPress()
                            setEmail(event.currentTarget.value)
                        }}
                />
                <StyledHelperContainer>
                    {newUser && <StyledHelperText>{emailError}</StyledHelperText>}
                </StyledHelperContainer>
            </>}
            <StyledLabel htmlFor="password" id="password">Password</StyledLabel>
            <StyledInput
                required
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={newUser
                    ? handlePasswordChange
                    : (event) => {
                        playKeyPress()
                        setPassword(event.currentTarget.value)
                    }}
            />
            <StyledHelperContainer>
                {newUser && <StyledHelperText>{passwordError}</StyledHelperText>}
            </StyledHelperContainer>
            <StyledButtonContainer>
                <StyledFormButton theme="success"
                                  type="submit"
                                  disabled={newUser ? !submitActive : false}>{newUser ? "Register" : "Login"}</StyledFormButton>
            </StyledButtonContainer>
        </StyledForm>
    </>
}
