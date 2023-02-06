import { useState, useCallback } from 'react';

const useSafeState = (unmountRef: { current: any }, defaultValue: any) => {
    const [state, changeState] = useState(defaultValue);
    const wrapChangeState = useCallback(
        (v: any) => {
            if (!unmountRef.current) {
                changeState(v);
            }
        },
        [changeState, unmountRef],
    );

    return [state, wrapChangeState];
};

export default useSafeState;
