import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader from '../components/PageHeader'
import AddMemberModal from '../modals/AddMemberModal'
import CardModal from '../modals/CardModal'
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { ReactSortable, SortableEvent } from 'react-sortablejs'
import cardService from '../services/card/card'
import $ from 'jquery'
import notify from '../utils/notify'
import './stylesheet/board.scss'
import { useNavigate, useParams } from 'react-router-dom'
import boardService from '../services/board/board'
import cardListService from '../services/cardList/card-lists'

interface AddedCardList {
  id: number
  name: string
  cards: { id: number; title: string; coverImage: string }[]
  cardForm: { open: boolean; title: string }
}

const BoardPage = () => {
  const [board, setBoard] = useState({ id: 0, name: '', personal: false })
  const [team, setTeam] = useState({ name: '' })
  const [members] = useState<{ id: number; name: string; shortName: string }[]>([])
  const [cardLists, setCardLists] = useState<AddedCardList[]>([])
  const [openedCard, setOpenedCard] = useState<{ cardListId?: number }>({})
  const [addListForm, setAddListForm] = useState({ open: false, name: '' })

  const focusedCardList = useMemo(() => {
    return cardLists.filter((cardList) => cardList.id === openedCard.cardListId)[0] || {}
  }, [])

  const navigate = useNavigate()

  const { cardId, boardId } = useParams()

  useEffect(() => {
    console.log('[BoardPage] mounted')
    loadInitial()
    window.addEventListener('click', (e) => dismissActiveForms(e))
    $('#cardModal').on('hide.bs.modal', () => {
      navigate('/board', { state: { boardId: board.id } })
    })
  }, [])

  const loadInitial = () => {
    if (cardId) {
      console.log('[BoardPage] Opened with card URL')
      loadCard(cardId)
        .then((card: Card) => {
          return loadBoard(card.boardId)
        })
        .then(() => {
          openCardWindow()
        })
    } else {
      console.log('[BoardPage] Opened with board URL')
      loadBoard(boardId)
    }
  }

  const loadBoard = (boardId: string | undefined) => {
    return new Promise<void>((resolve) => {
      boardService
        .getBoard(boardId)
        .then((data: { team: Team; board: Board; members: Member[]; cardLists: CardList[] }) => {
          setTeam({ ...team, name: data.team ? data.team.name : '' })
          setBoard({ ...board, id: data.board.id, personal: data.board.personal, name: data.board.name })

          members.splice(0)

          data.members.forEach((member) => {
            members.push({
              id: member.userId,
              name: member.name,
              shortName: member.shortName
            })
          })

          setCardLists((oldValue) => oldValue.splice(0))

          data.cardLists.sort((list1: CardList, list2: CardList) => {
            return list1.position - list2.position
          })

          data.cardLists.forEach((cardList: CardList) => {
            cardList.cards.sort((card1, card2) => {
              return card1.position - card2.position
            })

            setCardLists((oldValue) =>[...oldValue, {
              id: cardList.id,
              name: cardList.name,
              cards: cardList.cards,
              cardForm: {
                open: false,
                title: ''
              }
            }])
          })
          // TODO
          //  this.subscribeToRealTimeUpdate(data.board.id)
          resolve()
        })
        .catch((error: { message: string }) => {
          notify.error(error.message)
        })
    })
  }

  const loadCard = (cardId: string | undefined) => {
    return new Promise<Card>((resolve) => {
      cardService
        .getCard(cardId)
        .then((card: Card) => {
          setOpenedCard(card)
          resolve(card)
        })
        .catch((error) => {
          notify.error(error.message)
        })
    })
  }

  const openCardWindow = () => {
    $('#cardModal').modal('show')
  }

  const addCard = (cardList: AddedCardList) => {
    if (!cardList.cardForm.title.trim()) return

    const card = {
      boardId: board.id,
      cardListId: cardList.id,
      title: cardList.cardForm.title,
      position: cardList.cards.length + 1
    }
    cardService
      .add(card)
      .then((savedCard) => {
        appendCardToList(cardList, savedCard)
        cardList.cardForm.title = ''
        focusCardForm(cardList)
      })
      .catch((error) => {
        notify.error(error.message)
      })
  }

  const appendCardToList = (cardList: AddedCardList, card: Card) => {
    const existingIndex = cardList.cards.findIndex((existingCard) => existingCard.id === card.id)
    if (existingIndex === -1) {
      cardList.cards.push({
        id: card.id,
        title: card.title,
        coverImage: ''
      })
    }
  }

  const focusCardForm = (cardList: AddedCardList) => {
    // this.$nexTick(() => {
    // useLayoutEffect(() => {
    $('#cardTitle' + cardList.id).trigger('focus')
    // })
    // })
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>, cardList: AddedCardList) => {
    e.preventDefault()
    addCard(cardList)
  }

  const onKeyDownEnter = (e: KeyboardEvent<HTMLTextAreaElement>, cardList: AddedCardList) => {
    e.preventDefault()
    if (e.key === 'enter') {
      addCard(cardList)
    }
  }

  // const openCard = (card: any) => {
  //   const cardTitle = card.title.toLowerCase().trim().replace(/\s/g, '-')
  //   navigate('/card', { state: { cardId: card.id, cardTitle } })
  // }

  const addCardList = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!addListForm.name) {
      return
    }

    const cardList = {
      boardId: board.id,
      name: addListForm.name,
      position: cardLists.length + 1
    }

    cardListService.add(cardList)
      .then(savedCardList => {
        setCardLists((oldValue) => [...oldValue, {
          id: savedCardList.id,
          name: savedCardList.name,
          cards: [],
          cardForm: {
            open: false,
            title: ''
          }
        }])
        closeAddListForm()
      })
      .catch(error => {
        notify.error(error.message)
      })
  }

  const openAddMember = () => {
    $('#addMemberModal').modal('show')
  }

  const onCardListDragEnded = () => {
    console.log('[BoardPage] Card list drag ended')
    // Get the latest card list order and send it to the back-end
    const positionChanges: {boardId: number, cardListPositions: {cardListId: number, position: number}[]} = {
      boardId: board.id,
      cardListPositions: []
    }

    cardLists.forEach((cardList, index) => {
      positionChanges.cardListPositions.push({
        cardListId: cardList.id,
        position: index + 1
      })
    })

    cardListService.changePositions(positionChanges)
      .catch(error => {
        notify.error(error.message)
      })
  }

  const onCardDragEnded = (event: SortableEvent) => {
    console.log('card drag ended', event)
    // Get the card list that have card orders changed
    const fromListId = event.from.dataset.listId
    const toListId = event.to.dataset.listId
    const changedListIds = [fromListId]
    if (fromListId !== toListId) {
      changedListIds.push(toListId)
    }
    const positionChanges: {boardId: number, cardPositions: {cardListId: string | undefined, cardId: number, position: number}[]} = {
      boardId: board.id,
      cardPositions: []
    }
    changedListIds.forEach((cardListId ) => {
      const cardList = cardLists.filter(cardList => { return typeof cardListId === 'string' && cardList.id === parseInt(cardListId) })[0]
      cardList.cards.forEach((card, index) => {
        positionChanges.cardPositions.push({
          cardListId: cardListId,
          cardId: card.id,
          position: index + 1
        })
      })
    })
    cardService.changePositions(positionChanges)
      .catch(error => {
        notify.error(error.message)
      })
  }

  const openAddCardForm = (cardList: AddedCardList) => {
    cardLists.forEach(cardList => {cardList.cardForm.open = false})
    cardList.cardForm.open = true
    focusCardForm(cardList)
  }

  const closeAddCardForm = (cardList: AddedCardList) => {
    cardList.cardForm.open = false
  }

  const openAddListForm = () => {
    addListForm.open = true
    // TODO
    // this.$nextTick(() => {
    $('#cardListName').trigger('focus')
    // })
  }

  const closeAddListForm = () => {
    addListForm.open = false
    addListForm.name = ''
  }

  const onMemberAdded = (member: { id: number; name: string; shortName: string }) => {
    members.push(member)
  }

  const updateCardCoverImage = (coverImageCard: { cardListId: number; cardId: number; coverImage: string }) => {
    const cardList = cardLists.find(cardList => {
      return cardList.id === coverImageCard.cardListId
    })

    const card = cardList?.cards.find(card => {
      return card.id === coverImageCard.cardId
    })

    if(card !== undefined) card.coverImage = coverImageCard.coverImage
  }

  const dismissActiveForms = (event: MouseEvent) => {
    console.log('[BoardPage] Dismissing forms')
    let dismissAddCardForm = true
    let dismissAddListForm = true

    // TODO : 안되면 변경
    if(!(event.target instanceof Element)) return

    if (event.target.closest('.add-card-form') || event.target.closest('.add-card-button')) {
      dismissAddCardForm = false
    }
    if (event.target.closest('.add-list-form') || event.target.closest('.add-list-button')) {
      dismissAddListForm = false
    }
    if (dismissAddCardForm) {
      cardLists.forEach((cardList) => { cardList.cardForm.open = false })
    }
    if (dismissAddListForm) {
      addListForm.open = false
    }
  }

  const isCardListsSortingRef = useRef(false)

  useEffect(() => {
    if (!isCardListsSortingRef.current) return
    isCardListsSortingRef.current = false
    onCardListDragEnded()
  }, [cardLists])

  return (
    <>
      {board.id != null && (
        <div className='page'>
          <PageHeader />
          <div className='page-body'>
            <div className='board-wrapper'>
              <div className='board'>
                <div className='board-header clearfix'>
                  <div className='board-name board-header-item'>{board.name}</div>
                  <div className='board-header-divider' />
                  <div className='team-name board-header-item'>
                    {!board.personal && <span>{team.name}</span>}
                    {board.personal && <span>Personal</span>}
                  </div>
                  <div className='board-header-divider' />
                  <div className='board-members board-header-item'>
                    {members.map((member) => (
                      <div key={member.id} className='member'>
                        <span>{member.shortName}</span>
                      </div>
                    ))}
                    <div className='member add-member-toggle' onClick={openAddMember}>
                      <span>
                        <FontAwesomeIcon icon='user-plus' />
                      </span>
                    </div>
                  </div>
                </div>
                <div className='board-body'>
                  <ReactSortable
                    list={cardLists}
                    setList={setCardLists}
                    className='list-container'
                    handle='.list-header'
                    animation={0}
                    scrollSensitivity={100}
                    touchStartThreshold={20}
                    onEnd={() => isCardListsSortingRef.current = true}
                  >
                    {cardLists.map((cardList) => (
                      <div key={cardList.id} className='list-wrapper'>
                        <div className='list'>
                          <div className='list-header'>{cardList.name}</div>
                          <ReactSortable
                            list={cardList.cards}
                            setList={(currentList) => currentList}
                            className='cards'
                            handle='.card-item'
                            group='cards'
                            ghostClass='ghost-card'
                            animation={0}
                            scrollSensitivity={100}
                            touchStartThreshold={20}
                            data-list-id={cardList.id}
                            onEnd={(e) => onCardDragEnded(e)}
                          >
                            <>
                              <CardComponent cardList={cardList} />
                              {cardList.cardForm.open && (
                                <div className='add-card-form-wrapper'>
                                  <form
                                    className='add-card-form'
                                    onSubmit={(e) => onSubmit(e, cardList)}
                                  >
                                    <div className='form-group'>
                                      <textarea
                                        id={'cardTitle' + cardList.id}
                                        value={cardList.cardForm.title}
                                        className='form-control'
                                        placeholder='Type card title here'
                                        onKeyDown={(e) => onKeyDownEnter(e, cardList)}
                                      /* TODO : @keydown.enter.prevent=addCard(cardList) */
                                      />
                                    </div>
                                    <button type='submit' className='btn btn-sm btn-primary'>
                                    Add
                                    </button>
                                    <button
                                      type='button'
                                      className='btn btn-sm btn-link btn-cancel'
                                      onClick={() => closeAddCardForm(cardList)}
                                    >
                                    Cancel
                                    </button>
                                  </form>
                                </div>
                              )}
                            </>
                          </ReactSortable>
                          {!cardList.cardForm.open && (
                            <div
                              className='add-card-button'
                              onClick={() => openAddCardForm(cardList)}
                            >
                              + Add a card
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className='list-wrapper add-list'>
                      {!addListForm.open && (
                        <div className='add-list-button' onClick={openAddListForm}>
                          + Add a list
                        </div>
                      )}
                      {addListForm.open && (
                        <form className='add-list-form' onSubmit={(e) => addCardList(e)}>
                          <div className='form-group'>
                            <input
                              id='cardListName'
                              value={addListForm.name}
                              onChange={(e) =>
                                setAddListForm({ ...addListForm, name: e.target.value })
                              }
                              type='text'
                              className='form-control'
                              placeholder='Type list name here'
                            />
                          </div>
                          <button type='submit' className='btn btn-sm btn-primary'>
                            Add List
                          </button>
                          <button
                            type='button'
                            className='btn btn-sm btn-link btn-cancel'
                            onClick={closeAddListForm}
                          >
                            Cancel
                          </button>
                        </form>
                      )}
                    </div>
                  </ReactSortable>
                </div>
              </div>
            </div>
          </div>
          <AddMemberModal boardId={board.id} onAdded={() => onMemberAdded} />
          <CardModal
            card={openedCard}
            cardList={focusedCardList}
            board={board}
            members={members}
            onCoverImageChanged={() => updateCardCoverImage}
          />
        </div>
      )}
    </>
  )
}

export default BoardPage

function CardComponent({ cardList } : {cardList : AddedCardList}) {
  const component = cardList.cards.map((card) =>{
    return (
      <div
        key={card.id}
        className='card-item'
      // onClick={() => openCard(card)}
      >
        {card.coverImage != null && (
          <div className='cover-image'>
            <img src={card.coverImage} alt={'image'} />
          </div>
        )}
        <div className='card-title'>{card.title}</div>
      </div>
    )}
  )

  return <>{component}</>
}