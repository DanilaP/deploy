import { useEffect, useRef } from "react";

export default function useDebounceFunction(callback: any, delay: number) {

    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const debouncedFunc = (...args) => {
        if (timerRef.current) {
            clearTimeout(timerRef?.current);
        }
        timerRef.current = setTimeout(() => {
            callback();
        }, delay);
    };

    return debouncedFunc;
}