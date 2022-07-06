import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import logo from '../images/logo.png'

import { useRecoilState, useRecoilValue } from 'recoil'
import { userState, logout } from '../recoil/state'

import meService from '../services/me/me'
import notify from '../utils/notify'
import { useEffect } from 'react'
import { hasBoardsSelector, personalBoardsSelector, teamBoardsSelector } from '../recoil/selector'
import './stylesheet/pageheader.scss'

function PageHeader() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const hasBoards = useRecoilValue(hasBoardsSelector)
  const personalBoards = useRecoilValue(personalBoardsSelector)
  const teamBoards = useRecoilValue(teamBoardsSelector)
  const [user, setUser] = useRecoilState(userState)

  useEffect(() => {
    if (!user.authenticated) {
      meService.getMyData()
        .then(data => {
          setUser({ ...user, name: data.user.name, authenticated: true })
        })
    }
  },[])

  function goHome() {
    navigate('/')
  }

  function openBoard(board: Board) {
    navigate('/board', { state: { boardId: board.id } })
  }

  function signOut() {
    // this.$rt.logout()
    //
    meService
      .signOut()
      .then(() => {
        logout()
        navigate('/login')
      })
      .catch((error) => {
        notify.error(error.message)
      })
  }

  return (
    <>
      <div className='page-header d-flex align-content-center'>
        <div className='logo' onClick={goHome}>
          <FontAwesomeIcon icon='home' className='home-icon' />
          <img src={logo} alt='logo' />
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
              {hasBoards && (
                <>
                  {personalBoards.length && (
                    <h6 className='dropdown-header'>{t('header.boardsMenu.personalBoards')}</h6>
                  )}
                  {personalBoards.map((board, index) => (
                    <button
                      key={index}
                      className='dropdown-item'
                      type='button'
                      onClick={() => openBoard(board)}
                    >
                      {board.name}
                    </button>
                  ))}
                  {teamBoards.map((team: Team) => (
                    <>
                      <h6 className='dropdown-header'>{team.name}</h6>
                      {team.boards.map((board: Board, index) => (
                        <button
                          key={index}
                          className='dropdown-item'
                          type='button'
                          onClick={() => openBoard(board)}
                        >
                          {board.name}
                        </button>
                      ))}
                    </>
                  ))}
                </>
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
              <button className='dropdown-item' type='button' onClick={signOut}>
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
