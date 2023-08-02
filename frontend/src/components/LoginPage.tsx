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

export default function LoginPage() {
    const [newUser, setNewUser] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [usernameError, setUsernameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");

    const login = useStore(state => state.login)
    const register = useStore(state => state.register)
    const navigate = useNavigate()

    const submitActive = newUser
        ? (usernameError === "" && emailError === "" && passwordError === "")
        : (usernameError === "" && passwordError === "");

    function handleRegister(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        register(username, email, password);
        setNewUser(false)
    }

    function handleLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        login(username, password, navigate);
    }

    function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
        setUsername(event.target.value);
        if (event.target.value.length < 3) {
            setUsernameError("Username must have at least three characters");
        } else if (event.target.value.length > 15) {
            setUsernameError("Username cannot be longer than 15 characters");
        } else {
            setUsernameError("");
        }
        !newUser && setUsernameError("");
    }

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
        if (event.target.value.length < 3 && event.target.value.length > 50 && !event.target.value.match(/.+@.+\..+/)) {
            setEmailError("Invalid email");
        } else {
            setEmailError("");
        }
        !newUser && setEmailError("");
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
        if (event.target.value.length < 3) {
            setPasswordError("Password must have at least three characters");
        } else {
            setPasswordError("");
        }
        !newUser && setPasswordError("");
    }

    function handleNewUserSwitch() {
        setNewUser(!newUser);
        if (!newUser) {
            setUsernameError("");
            setEmailError("");
            setPasswordError("");
        }
    }

    return <>
        <StyledForm onSubmit={newUser ? handleRegister : handleLogin}>
            <legend>{newUser ? "Register" : "Login"}</legend>
            <StyledLabel htmlFor={"newUser"}>New User<Switch
                id="newUser"
                checked={newUser}
                onChange={handleNewUserSwitch}
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
                    : (event) => setUsername(event.currentTarget.value)}
            />
            <StyledHelperContainer>
                <StyledHelperText>{usernameError}</StyledHelperText>
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
                        : (event) => setEmail(event.currentTarget.value)}
                />
                <StyledHelperContainer>
                    <StyledHelperText>{emailError}</StyledHelperText>
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
                    : (event) => setPassword(event.currentTarget.value)}
            />
            <StyledHelperContainer>
                <StyledHelperText>{passwordError}</StyledHelperText>
            </StyledHelperContainer>
            <StyledButtonContainer>
                <StyledFormButton theme="error"
                                    type="button"
                                  onClick={() => navigate("/")}>Cancel</StyledFormButton>
                <StyledFormButton theme="success"
                                  type="submit"
                                  disabled={!submitActive}>{newUser ? "Register" : "Login"}</StyledFormButton>
            </StyledButtonContainer>
        </StyledForm>
    </>
}
