// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import useSound from "use-sound";
import upgrade from "../assets/sounds/upgrade.mp3";
import click from "../assets/sounds/click.mp3";
import loginSuccess from "../assets/sounds/login_success.mp3";
import error from "../assets/sounds/error.mp3";
import electricMachine from "../assets/sounds/electric_machine.mp3";
import zoomIn from "../assets/sounds/zoom_in.mp3";
import zoomOut from "../assets/sounds/zoom_out.mp3";
import switchSound from "../assets/sounds/switch.mp3";
import keyPress from "../assets/sounds/key_press.mp3";
import loadingOs from "../assets/sounds/loading_os.mp3";
import {useStore} from "../hooks/useStore.ts";

export function useUpgradeSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(upgrade, { volume });
    return play;
}

export function useClickSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(click, { volume });
    return play;
}

export function useLoginSuccessSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(loginSuccess, { volume });
    return play;
}

export function useErrorSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(error, { volume });
    return play;
}

export function useElectricMachineSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(electricMachine, { volume });
    return play;
}

export function useZoomInSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(zoomIn, { volume });
    return play;
}

export function useZoomOutSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(zoomOut, { volume });
    return play;
}

export function useSwitchSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(switchSound, { volume });
    return play;
}

export function useKeyPressSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(keyPress, { volume });
    return play;
}

export function useLoadingOsSound() {
    const volume = useStore.getState().volume;
    const [play] = useSound(loadingOs, { volume });
    return play;
}
