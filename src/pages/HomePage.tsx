import PageHeader from '../components/PageHeader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilValue } from 'recoil'
import { useTranslation } from 'react-i18next'
import CreateBoardModal from '../modals/CreateBoardModal'
import CreateTeamModal from '../modals/CreateTeamModal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as $ from 'jquery'
import { personalBoardsSelector, teamBoardsSelector } from '../recoil/selector'
import './stylesheet/home.scss'

function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedTeamId, setSelectedTeamId] = useState(0)
  const personalBoards = useRecoilValue(personalBoardsSelector)
  const teamBoards = useRecoilValue(teamBoardsSelector)

  const openBoard = (board: Board) => {
    navigate(`/board/${board.id}`)
  }

  const createBoard = (team: Team) => {
    setSelectedTeamId(team ? team.id : 0)
    $('#createBoardModal').modal('show')
  }

  const createTeam = () => {
    $('#createTeamModal').modal('show')
  }

  const onBoardCreated = (boardId: number) => {
    navigate('/board', { state: { boardId } })
  }

  return (
    <>
      <div>
        <PageHeader />
        <div className='boards-container'>
          <div className='boards-section'>
            <h2 className='section-title'>{t('homePage.personalBoards')}</h2>
            <div className='boards d-flex align-content-start flex-wrap'>
              {personalBoards.map((board: Board) => (
                <div
                  key={board.id}
                  className='board list-inline-item'
                  onClick={() => openBoard(board)}
                >
                  <h3>{board.name}</h3>
                  <p>{board.description}</p>
                </div>
              ))}
              <div
                id='createPersonalBoardBtn'
                className='board add list-inline-item'
                onClick={() => createBoard}
              >
                <FontAwesomeIcon icon='plus' />
                <div>{t('homePage.createNewBoard')}</div>
              </div>
            </div>
          </div>
          {teamBoards.map((team: Team) => (
            <div key={team.id} className='boards-section'>
              <h2 className='section-title'>{team.name}</h2>
              <div className='boards d-flex align-content-start flex-wrap'>
                {team.boards.map((board: Board) => (
                  <div
                    key={board.id}
                    className='board list-inline-item'
                    onClick={() => openBoard(board)}
                  >
                    <h3>{board.name}</h3>
                    <p>{board.description}</p>
                  </div>
                ))}
                <div className='board add list-inline-item' onClick={() => createBoard(team)}>
                  <FontAwesomeIcon icon='plus' />
                  <div>{t('homePage.createNewBoard')}</div>
                </div>
              </div>
            </div>
          ))}
          <div className='create-team-wrapper'>
            <button id='createTeamModalBtn' className='btn btn-link' onClick={createTeam}>
              + {t('homePage.createNewTeam')}
            </button>
          </div>
        </div>
        <CreateBoardModal teamId={selectedTeamId} onCreated={() => onBoardCreated} />
        <CreateTeamModal />
      </div>
    </>
  )
}

export default HomePage
