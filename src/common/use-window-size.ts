import { useEffect, useState } from 'react';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
function getSize() {
    return {
        width: isClient ? window.innerWidth : undefined,
        height: isClient ? window.innerHeight : undefined
    };
}
const isClient = typeof window === 'object';
export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        if (!isClient) {
            return;
        }

        const resize$ = fromEvent(window, 'resize').pipe(
            distinctUntilChanged(),
            debounceTime(1000)
        ).subscribe(() => {
            setWindowSize(getSize());

        })
        return () => {
            resize$.unsubscribe();
        };
    }, [])

    return windowSize;
}
