import { useEffect } from 'react';

function useClickOutside(ref) {

    useEffect(() => {

        const handleClickOutside = (e) => {
            if (ref && !ref.current.contains(e.target)) {
                ref.current.classList.remove("active");
            }
        }

        window.addEventListener("mousedown", handleClickOutside);

        return () => window.removeEventListener("mousedown", handleClickOutside)
    }, [ref])

}

export default useClickOutside
