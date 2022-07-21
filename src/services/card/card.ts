import axios from 'axios'
import errorParser from '../../utils/error-parser'

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
  changeCardDescription (cardId: number, description: string) {
    return new Promise<{cardId: number, description: string}>((resolve, reject) => {
      axios.put('/cards/' + cardId + '/description', { description }).then(({ data }) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  addCardComment (cardId: number, comment: string) {
    return new Promise<Activity>((resolve, reject) => {
      axios.post('/cards/' + cardId + '/comments', { comment }).then(({ data }) => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getCardActivities (cardId: number) {
    return new Promise<{ activities: Activity[] }>((resolve, reject) => {
      axios.get('/cards/' + cardId + '/activities').then(({ data }) => {
        resolve(data)
      }).catch(error => {
        reject(errorParser.parse(error))
      })
    })
  },
  getCardAttachments (cardId: number) {
    return new Promise<{ attachments: Attachment[] }>((resolve, reject) => {
      axios.get('/cards/' + cardId + '/attachments').then(({ data }) => {
        resolve(data)
      }).catch(error => {
        reject(errorParser.parse(error))
      })
    })
  }
}