import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import logo from '../images/logo.png'

function PageHeader() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function goHome() {
    navigate('/home')
  }

  return (
    <>
      <div className='page-header d-flex align-content-center'>
        <div className='logo' onClick={goHome}>
          <FontAwesomeIcon icon='home' className='home-icon' />
          <img src={logo} />
        </div>
        <div className='boards-menu-toggle'>
          <div className='dropdown'>
            <button
              id='boardsMenu'
              className='btn dropdown-toggle'
              type='button'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              {t('header.boardsMenu.label')}
            </button>
            <div className='dropdown-menu' aria-labelledby='boardsMenu'>
              {!hasBoards && <div className='dropdown-item'>{t('header.boardsMenu.noBoard')}</div>}
              {hasBoard && (
                <div>
                  {personalBoards.length && (
                    <h6 className='dropdown-header'>{t('header.boardsMenu.personalBoards')}</h6>
                  )}
                  <button
                    v-for='board in personalBoards'
                    className='dropdown-item'
                    type='button'
                    onClick={openBoard(board)}
                  >
                    {board.name}
                  </button>
                  <div v-for='team in teamBoards'>
                    <h6 className='dropdown-header'>{team.name}</h6>
                    <button
                      v-for='board in team.boards'
                      className='dropdown-item'
                      type='button'
                      onClick={openBoard(board)}
                    >
                      {board.name}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className='search-box flex-fill'>
          <div className='search-wrapper'>
            <FontAwesomeIcon icon='search' className='search-icon' />
            <input
              type='text'
              placeholder={t('header.search')}
              className='form-control form-control-sm'
            />
          </div>
        </div>
        <div className='profile-menu-toggle'>
          <div className='dropdown'>
            <button
              id='profileMenu'
              className='btn dropdown-toggle'
              type='button'
              data-toggle='dropdown'
              aria-haspopup='true'
              aria-expanded='false'
            >
              {user.name}
            </button>
            <div className='dropdown-menu' aria-labelledby='profileMenu'>
              <button className='dropdown-item' type='button'>
                {t('header.profile')}
              </button>
              <button className='dropdown-item' type='button' onClick={signOut()}>
                {t('header.signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PageHeader
