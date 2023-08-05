import {useEffect, useState} from 'react';
import axios from 'axios';
import {Player} from "../models.ts";

export default function usePlayer(name: string) {
    const [player, setPlayer] = useState<Player>();

    useEffect(() => {
        if (!name) {
            return
        }
        axios
            .get(name && `/api/player/info/${name}`)
            .then((response) => response.data)
            .then((data: Player) => {
                setPlayer(data);
            })
            .catch(console.error);
    }, [name]);

    return player;
}
