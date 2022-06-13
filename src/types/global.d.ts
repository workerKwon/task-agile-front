export {}

declare global {
  interface Board {
    name: string
    id: number
    description: string
  }

  interface Team {
    id: number
    name: string
    boards: Array<Board>
  }

  interface User {
    name: string | null
    authenticated: boolean
  }

  interface Member {
    id: number
    shortName: string
  }

  interface CardList {
    id: number
    name: string
    cardForm: Card
    cards: Card[]
  }

  interface Card {
    id: number
    title: string
    coverImage: string
  }
}