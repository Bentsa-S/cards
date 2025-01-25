import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

export function useMenuAnimation(setIndicatorPosition) {
    const location = useLocation();
    useEffect(() => {
        const updatePosition = () => {
            const routes = ['/', '/rooms', '/create'];
            const index = routes.indexOf(location.pathname);
            let number = 0;
            const containerWidth = 80;
            console.log(index); 
            switch (index) {
                case 1:
                    number = (window.innerWidth / 2 - containerWidth / 2) - 11;
                    break;
                case -1:
                    number = window.innerWidth - containerWidth - 8;
                    break;
                default:
                    number = 0 - 11;
                    break;
            }
            setIndicatorPosition(number);
        };
    
        updatePosition();
        window.addEventListener('resize', updatePosition);
    
        return () => window.removeEventListener('resize', updatePosition);
    }, [location, setIndicatorPosition]);
    
}
