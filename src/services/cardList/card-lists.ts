import axios from 'axios'

export default {
  add(cardList: {boardId: number, name: string, position: number}) {
    return new Promise<CardList>((resolve, reject) => {
      axios.post('/card-lists', cardList)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  changePositions(positionChanges: {boardId: number, cardListPositions: {cardListId: number, position: number}[]}) {
    return new Promise<CardList>((resolve, reject) => {
      axios.post('/card-lists/positions', positionChanges)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}
