import axios from 'axios'

type AddCard = {
  boardId: number
  cardListId: number
  title: string
  position: number
}

export default {
  add(card: AddCard) {
    return new Promise<Card>((resolve, reject) => {
      axios.post('/cards', card)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getCard(cardId: string | undefined) {
    return new Promise<Card>((resolve, reject) => {
      axios.get('/cards/' + cardId).then(({ data }) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  changePositions(positionChanges: {boardId: number, cardPositions: {cardListId: string | undefined, cardId: number, position: number}[]}) {
    return new Promise<Card>((resolve, reject) => {
      axios.post('/cards/positions', positionChanges)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  changeCardDescription (cardId: string, description: string) {
    return new Promise((resolve, reject) => {
      axios.put('/cards/' + cardId + '/description', { description }).then(({ data }) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addCardComment (cardId, comment) {
    return new Promise((resolve, reject) => {
      axios.post('/cards/' + cardId + '/comments', { comment }).then(({ data }) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}