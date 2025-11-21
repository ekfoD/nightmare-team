import './TopBarBase.css'
import settingsIcon from "../assets/setting_icon.svg";
function TopBarBase() {
    return (
        <div className="TopBar">
            <button className='HomeButton'>POS application</button>
            <a href="https://www.youtube.com/watch?v=Ml58rcf7jH8&list=RDMl58rcf7jH8&start_radio=1" className="SettingsButton">
                <img src={settingsIcon} alt="SETTINGS" className="settings_icon" />
            </a>
        </div>
    );
}

export default TopBarBase;