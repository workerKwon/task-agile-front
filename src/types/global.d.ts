export {}

declare global {
  interface Board {
    name: string
    id: number
  }

  interface Team {
    name: string
    boards: Array<Board>
  }

  interface User {
    name: string
  }
}