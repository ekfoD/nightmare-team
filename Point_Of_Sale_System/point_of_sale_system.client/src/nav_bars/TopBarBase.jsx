import './TopBarBase.css'
import settingsIcon from "../assets/setting_icon.svg";
import { useNavigate, NavLink } from "react-router-dom";

function TopBarBase() {
    return (
        <div className="TopBar">
            <button className='HomeButton'>POS application</button>
            <NavLink className="settingsIconHolder" to="https://www.youtube.com/watch?v=CcCw1ggftuQ" end>
                <img src={settingsIcon} alt="SETTINGS" className="settings_icon" />
            </NavLink>
        </div>
    );
}

export default TopBarBase;