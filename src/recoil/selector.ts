import { selector } from 'recoil'
import { boardsState, teamsState } from './state'

export const hasBoardsSelector = selector<boolean>({
  key: 'hasBoardsSelector',
  get: ({ get }) => {
    return get(boardsState).length > 0
  }
})

export const personalBoardsSelector = selector<Board[]>({
  key: 'personalBoardsSelector',
  get: ({ get }) => {
    return get(boardsState).filter(board => board.teamId === 0)
  }
})

export const teamBoardsSelector = selector<Team[]>({
  key: 'teamBoardsSelector',
  get: ({ get }) => {
    const teams: { id:number, name: string, boards: Board[] }[] = []
    get(teamsState).forEach(team => {
      teams.push({
        id: team.id,
        name: team.name,
        boards: get(boardsState).filter(board => board.teamId === team.id)
      })
    })
    return teams
  }
})