import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import logo from '../images/logo.png'

import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { userState, boardsState, teamsState } from '../recoil/state'

import meService from '../services/me/me'
import notify from '../utils/notify'
import { useEffect, Fragment } from 'react'
import { hasBoardsSelector, personalBoardsSelector, teamBoardsSelector } from '../recoil/selector'
import './stylesheet/pageheader.scss'

function PageHeader() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const hasBoards = useRecoilValue(hasBoardsSelector)
  const personalBoards = useRecoilValue(personalBoardsSelector)
  const teamBoards = useRecoilValue(teamBoardsSelector)
  const [user, setUser] = useRecoilState(userState)
  const setTeams = useRecoilState(teamsState)[1]
  const setBoards = useRecoilState(boardsState)[1]

  const resetBoards = useResetRecoilState(boardsState)
  const resetTeams = useResetRecoilState(teamsState)
  const resetUser = useResetRecoilState(userState)

  useEffect(() => {
    if (!user.authenticated) {
      meService.getMyData()
        .then(data => {
          setUser({ ...user, name: data.user.name, authenticated: true })
          setTeams([...data.teams])
          setBoards([...data.boards])
        })
    }
  }, [])

  function goHome() {
    navigate('/')
  }

  function signOut() {
    // this.$rt.logout()
    //
    meService.signOut()
      .then(() => {
        resetBoards()
        resetTeams()
        resetUser()
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
                  {personalBoards.length > 0 && (
                    <h6 className='dropdown-header'>{t('header.boardsMenu.personalBoards')}</h6>
                  )}
                  <PersonalBoardsComponent personalBoards={personalBoards}/>
                  <TeamComponent teamBoards={teamBoards} />
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

function PersonalBoardsComponent({ personalBoards } : {personalBoards: Board[]}) {

  const navigate = useNavigate()

  function openBoard(board: Board) {
    navigate(`/board/${board.id}`)
  }

  const personalBoardsComponent = personalBoards.map((board, index) =>
    <button
      key={index}
      className='dropdown-item'
      type='button'
      onClick={() => openBoard(board)}
    >
      {board.name}
    </button>
  )

  return <>{personalBoardsComponent}</>
}

function TeamBoardsComponent({ team }: { team: Team }) {

  const navigate = useNavigate()

  function openBoard(board: Board) {
    navigate(`/board/${board.id}`)
  }

  const teamComponent = team.boards.map((board: Board, index) =>
    <button
      key={index}
      className='dropdown-item'
      type='button'
      onClick={() => openBoard(board)}
    >
      {board.name}
    </button>
  )

  return <>{ teamComponent }</>
}


function TeamComponent({ teamBoards } : {teamBoards: Team[]}) {
  const teamComponent = teamBoards.map((team: Team, index) =>
    <Fragment key={index}>
      <h6 className='dropdown-header'>{team.name}</h6>
      <TeamBoardsComponent team={team} />
    </Fragment>
  )

  return <>{ teamComponent }</>
}