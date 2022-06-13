import api from '../../axios/api'

type AddCard = {
  boardId: number
  cardListId: number
  title: string
  position: number
}

export default {
  add(card: AddCard) {
    return new Promise<Card>((resolve, reject) => {
      api.post('/cards', card)
        .then(({data}) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getCard(cardId: string | undefined) {
    return new Promise<Card>((resolve, reject) => {
      api.get('/cards/' + cardId).then(({ data }) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}