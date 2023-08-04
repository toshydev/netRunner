import {useEffect, useState} from 'react';
import axios from 'axios';

export default function useOwner(ownerId: string) {
    const [owner, setOwner] = useState<string>('');

    useEffect(() => {
        if (!ownerId) {
            setOwner('');
            return;
        }

        axios
            .get(`/api/player/${ownerId}`)
            .then((response) => response.data)
            .then((data: string) => {
                setOwner(data || '');
            })
            .catch(() => setOwner(''));
    }, [ownerId]);

    return owner;
};