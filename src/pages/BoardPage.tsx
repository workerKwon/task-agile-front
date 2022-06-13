import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader from '../components/PageHeader'
import AddMemberModal from '../modals/AddMemberModal'
import CardModal from '../modals/CardModal'
import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import cardService from '../services/card/card'
import $ from 'jquery'
import notify from '../utils/notify'
import './stylesheet/board.scss'
import { useNavigate, useParams } from 'react-router-dom'
import boardService from '../services/board/board'

type AddedCardList = {
  id: number
  name: string
  cards: {id: number, title: string, coverImage: string}[]
  cardForm: { open: boolean, title: string }
}

const BoardPage = () => {
  const [board] = useState({ id: 0, name: '', personal: false })
  const [team] = useState({ name: '' })
  const [members] = useState<{id: number, name: string, shortName: string}[]>([])
  const [cardLists] = useState<AddedCardList[]>([])
  const [openedCard, setOpenedCard] = useState<{ cardListId?: number }>({})

  const focusedCardList = useMemo(() => {
    return cardLists.filter(cardList => cardList.id === openedCard.cardListId)[0] || {}
  }, [])

  const navigate = useNavigate()

  const { cardId, boardId } = useParams()

  useEffect(() => {
    console.log('[BoardPage] mounted')
    loadInitial()
    window.addEventListener('click', dismissActiveForms)
    $('#cardModal').on('hide.bs.modal', () => {
      navigate('/board', { state: { boardId: board.id }})
    })
  }, [])

  const loadInitial = () => {
    if(cardId) {
      console.log('[BoardPage] Opened with card URL')
      loadCard(cardId).then((card: Card) => {
        return loadBoard(card.boardId)
      }).then(() => {
        openCardWindow()
      })
    } else {
      console.log('[BoardPage] Opened with board URL')
      loadBoard(boardId)
    }
  }

  const loadBoard = (boardId: string | undefined) => {
    return new Promise<void>(resolve => {
      boardService.getBoard(boardId).then((data: { team: Team; board: Board; members: Member[]; cardLists: CardList[] }) => {
        team.name = data.team ? data.team.name : ''
        board.id = data.board.id
        board.personal = data.board.personal
        board.name = data.board.name

        members.splice(0)

        data.members.forEach(member => {
          members.push({
            id: member.userId,
            name: member.name,
            shortName: member.shortName
          })
        })

        cardLists.splice(0)

        data.cardLists.sort((list1: CardList, list2: CardList) => {
          return list1.position - list2.position
        })

        data.cardLists.forEach((cardList: CardList) => {
          cardList.cards.sort((card1, card2) => {
            return card1.position - card2.position
          })

          cardLists.push({
            id: cardList.id,
            name: cardList.name,
            cards: cardList.cards,
            cardForm: {
              open: false,
              title: ''
            }
          })
        })
        // TODO
        //  this.subscribeToRealTimeUpdate(data.board.id)
        resolve()
      }).catch((error: { message: string }) => {
        notify.error(error.message)
      })
    })
  }

  const loadCard = (cardId: string | undefined) => {
    return new Promise<Card>(resolve => {
      cardService.getCard(cardId).then((card: Card) => {
        setOpenedCard(card)
        resolve(card)
      }).catch(error => {
        notify.error(error.message)
      })
    })
  }

  const openCardWindow = () => {
    $('#cardModal').modal('show')
  }

  const addCard = (cardList: AddedCardList) => {
    if(!cardList.cardForm.title.trim()) return

    const card = {
      boardId: board.id,
      cardListId: cardList.id,
      title: cardList.cardForm.title,
      position: cardList.cards.length + 1
    }
    cardService.add(card)
      .then(savedCard => {
        appendCardToList(cardList, savedCard)
        cardList.cardForm.title = ''
        focusCardForm(cardList)
      })
      .catch((error) => {
        notify.error(error.message)
      })
  }

  const appendCardToList = (cardList: AddedCardList, card: Card) => {
    const existingIndex = cardList.cards.findIndex(existingCard => existingCard.id === card.id)
    if(existingIndex === -1) {
      cardList.cards.push({
        id: card.id,
        title: card.title,
        coverImage: ''
      })
    }
  }

  const focusCardForm = (cardList: AddedCardList) => {
    // this.$nexTick(() => {
    $('#cardTitle' + cardList.id).trigger('focus')
    // })
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>, cardList: AddedCardList) => {
    e.preventDefault()
    addCard(cardList)
  }

  const onKeyDownEnter = (e: KeyboardEvent<HTMLTextAreaElement>, cardList: AddedCardList) => {
    e.preventDefault()
    if(e.key === 'enter') {
      addCard(cardList)
    }
  }

  const openCard = (card: any) => {
    card
  }

  const addCardList = (e: { preventEvent: () => string }) => {
    e.preventEvent()
  }

  const openAddMember = () => {
    openCard(1)
  }

  const onCardListDragEnded = () => {
    openCard(1)
  }

  const onCardDragEnded = () => {
    openCard(1)
  }

  const openAddCardForm = (cardList: AddedCardList) => {
    openCard(cardList)
  }

  const closeAddCardForm = (cardList: AddedCardList) => {
    openCard(cardList)
  }

  const openAddListForm = () => {
    openCard(1)
  }

  const closeAddListForm = () => {
    openCard(1)
  }

  const onMemberAdded = () => {
    openCard(1)
  }

  const updateCardCoverImage = () => {
    openCard(1)
  }

  const dismissActiveForms = () => {
    openCard(1)
  }

  return (
    <div
      v-show="board.id"
      className="page"
    >
      <PageHeader />
      <div className="page-body">
        <div className="board-wrapper">
          <div className="board">
            <div className="board-header clearfix">
              <div className="board-name board-header-item">
                { board.name }
              </div>
              <div className="board-header-divider" />
              <div className="team-name board-header-item">
                <span v-if="!board.personal">{ team.name }</span>
                <span v-if="board.personal">Personal</span>
              </div>
              <div className="board-header-divider" />
              <div className="board-members board-header-item">
                {
                  members.map((member) => (
                    <div key={member.id} className="member"
                    >
                      <span>{ member.shortName }</span>
                    </div>
                  ))
                }
                
                <div
                  className="member add-member-toggle"
                  onClick={openAddMember}
                >
                  <span><FontAwesomeIcon icon="user-plus" /></span>
                </div>
              </div>
            </div>
            <div className="board-body">
              <ReactSortable
                v-model="cardLists"
                className="list-container"
                handle=".list-header"
                animation={0}
                scrollSensitivity={100}
                touchStartThreshold={20}
                onEnd={onCardListDragEnded}
              >
                {
                  cardLists.map(cardList => (
                    <div
                      key={cardList.id}
                      className="list-wrapper"
                    >
                      <div className="list">
                        <div className="list-header">
                          { cardList.name }
                        </div>
                        <ReactSortable
                          // value={addCardList.cards}
                          className="cards"
                          draggable=".card-item"
                          group="cards"
                          ghostClass="ghost-card"
                          animation={0}
                          scrollSensitivity={100}
                          touchStartThreshold={20}
                          // dataListId={cardList.id}
                          onEnd={onCardDragEnded}
                        >
                          {
                            cardList.cards.map(card => (
                              <div
                                key={card.id}
                                className="card-item"
                                onClick={() => openCard(card)}
                              >
                                <div
                                  v-if="card.coverImage"
                                  className="cover-image"
                                >
                                  <img src={card.coverImage} />
                                </div>
                                <div className="card-title">
                                  { card.title }
                                </div>
                              </div>
                            ))
                          }
                          <div
                            v-if="cardList.cardForm.open"
                            className="add-card-form-wrapper"
                          >
                            <form
                              className="add-card-form"
                              onSubmit={(e) => onSubmit(e, cardList)}
                            >
                              <div className="form-group">
                                <textarea
                                  id={'cardTitle' + cardList.id}
                                  value={cardList.cardForm.title}
                                  className="form-control"
                                  placeholder="Type card title here"
                                  onKeyDown={(e) => onKeyDownEnter(e, cardList)}
                                  /* TODO : @keydown.enter.prevent=addCard(cardList) */
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-sm btn-primary"
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-link btn-cancel"
                                onClick={() => closeAddCardForm(cardList)}
                              >
                                Cancel
                              </button>
                            </form>
                          </div>
                        </ReactSortable>
                        <div
                          v-show="!cardList.cardForm.open"
                          className="add-card-button"
                          onClick={() => openAddCardForm(cardList)}
                        >
                          + Add a card
                        </div>
                      </div>
                    </div>
                  ))
                }
                <div className="list-wrapper add-list">
                  <div
                    v-show="!addListForm.open"
                    className="add-list-button"
                    onClick={openAddListForm}
                  >
                    + Add a list
                  </div>
                  <form
                    v-show="addListForm.open"
                    className="add-list-form"
                    onSubmit={() => addCardList}
                  >
                    <div className="form-group">
                      <input
                        id="cardListName"
                        v-model="addListForm.name"
                        type="text"
                        className="form-control"
                        placeholder="Type list name here"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary"
                    >
                      Add List
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-link btn-cancel"
                      onClick={closeAddListForm}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              </ReactSortable>
            </div>
          </div>
        </div>
      </div>
      <AddMemberModal
        boardId={board.id}
        onAdded={() => onMemberAdded}
      />
      <CardModal
        card={openedCard}
        cardList={focusedCardList}
        board={board}
        members={members}
        onCoverImageChanged={updateCardCoverImage}
      />
    </div>
  )
}

export default BoardPage
