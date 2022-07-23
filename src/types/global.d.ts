export {}

declare global {
  interface Board {
    name: string
    id: number
    teamId: number
    description: string
    personal: boolean
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
    userId: number
    name: string
    shortName: string
  }

  interface Activity {
    id: number
    userId: number
    detail: string
    type: string
    createdDate: any
  }

  interface Attachment {
    id: number
    previewUrl: string
    fileType: string
    fileName: string
    fileUrl: string
    createdDate: any
  }

  interface CardList {
    id: number
    name: string
    cardForm: Card
    cards: Card[]
    position: number
  }

  interface Card {
    id: number
    title: string
    boardId: number
    cardListId: number
    description: string
    coverImage: string
    position: number
  }
}