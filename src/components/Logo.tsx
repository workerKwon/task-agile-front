import logo from '../images/logo.png'

function Logo() {
    return (
        <div className="logo-wrapper">
            <img className="logo" src={logo}/>
            <div className="tagline">Open source task management tool</div>
        </div>
    );
}

export default Logo