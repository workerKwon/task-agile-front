import logo from '../images/logo.png'
import './stylesheet/logo.scoped.scss'

function Logo() {
  return (
    <>
      <div className='logo-wrapper'>
        <img className='logo' src={logo} alt='logo' />
        <div className='tagline'>Open source task management tool</div>
      </div>
    </>
  )
}

export default Logo
