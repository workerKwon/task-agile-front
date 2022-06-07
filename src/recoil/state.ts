import { atom } from 'recoil'

export const hasBoardsState = atom<boolean>({
  key: 'hasBoards',
  default: false
})

export const personalBoardsState = atom<Board[]>({
  key: 'personalBoards',
  default: []
})

export const teamBoardsState = atom<Team[]>({
  key: 'teamBoards',
  default: []
})

export const userState = atom<User>({
  key: 'user',
  default: Object
})
