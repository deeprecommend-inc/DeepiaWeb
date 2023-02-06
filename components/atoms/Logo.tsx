import { useAppSelector } from "../../redux/hooks";

export const Logo = () => {
    const dark = useAppSelector((state) => state.ui.dark);

    const clickLogo = () => {
        return false;
    };

    return (
        <img src={dark ? '/logo-white.png' : '/logo.png'} className="w-8 mr-4" onContextMenu={clickLogo} />
    );
};

export default Logo;
