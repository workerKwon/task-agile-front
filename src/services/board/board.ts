import axios from 'axios'

type SavedBoard = {
  teamId: number
  name: string
  description: string
}

type GetBoard = {
  board: Board
  team: Team
  members: Member[]
  cardLists: CardList[]
}

export default {
  create(board: SavedBoard) {
    return new Promise<Board>((resolve, reject) => {
      axios.post('/boards', board)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getBoard(boardId: number | string | undefined) {
    return new Promise<GetBoard>((resolve, reject) => {
      axios.get('/boards/' + boardId).then(({ data }) => {
        resolve(data)
      }).catch((error) => {
        reject(error)
      })
    })
  }
}