import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import logo from '../images/logo.png'

import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { userState, boardsState, teamsState } from '../recoil/state'

import meService from '../services/me/me'
import notify from '../utils/notify'
import realTimeClient from '../real-time-client'
import { useEffect, Fragment, ChangeEvent, useState, MouseEvent } from 'react'
import { hasBoardsSelector, personalBoardsSelector, teamBoardsSelector } from '../recoil/selector'
import './stylesheet/pageheader.scoped.scss'
import { debounce } from 'lodash'

function PageHeader() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const hasBoards = useRecoilValue(hasBoardsSelector)
  const personalBoards = useRecoilValue(personalBoardsSelector)
  const teamBoards = useRecoilValue(teamBoardsSelector)
  const [user, setUser] = useRecoilState(userState)
  const setTeams = useRecoilState(teamsState)[1]
  const setBoards = useRecoilState(boardsState)[1]
  const [searchedData, setSearchedData] = useState<any>({ boards:[], cards: [] })

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
    realTimeClient.logout()

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

  const searchItems = debounce((e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) {
      setSearchedData({ boards: [], cards: [] })
      return
    }

    meService.getSearchedItem(e.target.value)
      .then((data) => {
        setSearchedData(data)
        console.log(data)
      })
      .catch((error) => {
        notify.error(error.message)
      })
  }, 500)

  const toggleDropdownItems = (e: MouseEvent) => {
    e.preventDefault()
    const toggle = document.getElementById('dropdownItems')
    if(toggle) {
      toggle.classList.toggle('show')
    }
  }

  const removeDropdownItems = () => {
    const toggle = document.getElementById('dropdownItems')
    if(toggle) {
      toggle.classList.remove('show')
    }
  }

  const goToBoard = (boardId: number) => {
    navigate(`/board/${boardId}`)
    removeDropdownItems()
  }

  const goToCard = (cardId: number, cardTitle: string) => {
    navigate(`/card/${cardId}/${cardTitle}`)
    removeDropdownItems()
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
              onChange={(event) => searchItems(event)}
              onClick={(e) => toggleDropdownItems(e)}
              // onBlur={() => removeDropdownItems()}
            />
            <div className="dropdown-items" id="dropdownItems">
              <>
                <div className="dropdown-title">boards</div>
                {
                  searchedData.boards.map((board: any) => (
                    <a key={board.id} className="dropdown-item" onClick={() => goToBoard(board.id)}>{board.name}</a>
                  ))
                }
                <div className="dropdown-title">cards</div>
                {
                  searchedData.cards.map((card: any) => (
                    <a key={card.id} className="dropdown-item" onClick={() => goToCard(card.id, card.title)}>{card.title}</a>
                  ))
                }
              </>
            </div>
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