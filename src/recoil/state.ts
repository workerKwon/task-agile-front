import { atom, useResetRecoilState } from 'recoil'

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
  default: {
    name: null,
    authenticated: false
  }
})

export const boardsState = atom<Board[]>({
  key: 'boards',
  default: []
})

export const teamsState = atom<Team[]>({
  key: 'teams',
  default: []
})

export const membersState = atom<Member[]>({
  key: 'members',
  default: []
})

export const cardListsState = atom<CardList[]>({
  key: 'cardLists',
  default: []
})

export const logout = () => {
  useResetRecoilState(boardsState)
  useResetRecoilState(teamsState)
  useResetRecoilState(userState)
}
