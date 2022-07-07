import { atom } from 'recoil'

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