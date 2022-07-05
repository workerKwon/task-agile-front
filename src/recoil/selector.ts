import { selector } from 'recoil'
import myService from '../services/me/me'
import { boardsState, teamsState } from './state'
// import { teamsState } from './state'

export const myDataSelector = selector({
  key: 'myDataSelector',
  get: async () => {
    const data = await myService.getMyData()
    // console.log(data)
    return data
  }
  // set: ({ get }, newValue) => {
  //   console.log(get(teamsState))
  //   console.log(newValue)
  // }
})

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
    const teams: {id:number, name: string, boards: Board[]}[] = []
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