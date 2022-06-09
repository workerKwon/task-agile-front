import api from '../../axios/api'

type SavedBoard = {
  teamId: number
  name: string
  description: string
}

export default {
  create(board: SavedBoard) {
    return new Promise<Board>((resolve, reject) => {
      api.post('/boards', board)
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}