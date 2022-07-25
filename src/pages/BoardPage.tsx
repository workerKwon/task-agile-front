import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader from '../components/PageHeader'
import AddMemberModal from '../modals/AddMemberModal'
import CardModal from '../modals/CardModal'
import {
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { ReactSortable, SortableEvent } from 'react-sortablejs'
import cardService from '../services/card/card'
import $ from 'jquery'
import notify from '../utils/notify'
import './stylesheet/board.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import boardService from '../services/board/board'
import cardListService from '../services/cardList/card-lists'
import { useForm } from 'react-hook-form'

interface AddedCardList {
  id: number
  name: string
  cards: { id: number; title: string; coverImage: string; description?: string }[]
  cardForm: { open: boolean; title: string }
}

const BoardPage = () => {
  const [board, setBoard] = useState({ id: 0, name: '', personal: false })
  const [team, setTeam] = useState({ name: '' })
  const [members] = useState<{ id: number; name: string; shortName: string }[]>([])
  const [cardLists, setCardLists] = useState<AddedCardList[]>([])
  const [openedCard, setOpenedCard] = useState<Card>({
    boardId: 0,
    cardListId: 0,
    coverImage: '',
    description: '',
    id: 0,
    position: 0,
    title: ''
  })
  const [addListForm, setAddListForm] = useState(false)
  const [cardsEvent, setCardsEvent] = useState<SortableEvent>()
  const { register: cardListRegister, handleSubmit: cardListHandleSubmit, reset: resetCardList } = useForm<{ name: string }>()
  const { register: cardRegister, handleSubmit: cardHandleSubmit, getValues, reset: resetCard } = useForm<{title: string}>()

  const focusedCardList = useMemo(() => {
    return cardLists.filter((cardList) => cardList.id === openedCard.cardListId)[0] || {}
  }, [openedCard])

  const navigate = useNavigate()

  const location = useLocation()

  const { cardId, boardId } = useParams()

  const fromRouteRef = useRef(location.pathname)
  // const fromBoardIdRef = useRef(boardId)

  useEffect(() => {
    if (location.pathname.match('board') && fromRouteRef.current.match('board')) {
      // unsubscribeFromRealTimeUpdate(fromBoardIdRef.current)
      loadBoard(boardId)
    }

    if (location.pathname.match('card') && fromRouteRef.current.match('board')) {
      loadCard(cardId).then(() => {
        openCardWindow()
      })
    }

    if (location.pathname.match('board') && fromRouteRef.current.match('card')) {
      closeCardWindow()
      setOpenedCard({
        boardId: 0,
        cardListId: 0,
        coverImage: '',
        description: '',
        id: 0,
        position: 0,
        title: ''
      })
    }

    fromRouteRef.current = location.pathname
  }, [location])

  useEffect(() => {
    console.log('[BoardPage] mounted')
    loadInitial()
    window.addEventListener('click', (e) => dismissActiveForms(e))
  }, [])

  useEffect(() => {
    $('#cardModal').on('hide.bs.modal', () => {
      navigate(`/board/${board.id}`)
    })
  }, [board])

  const isCardListsSortingRef = useRef(false)
  const isCardsSortingRef = useRef(false)

  useEffect(() => {
    if (!isCardListsSortingRef.current) return
    isCardListsSortingRef.current = false
    onCardListDragEnded()
  }, [cardLists])

  useEffect(() => {
    if (!isCardsSortingRef.current) return
    isCardsSortingRef.current = false
    if (cardsEvent) {
      onCardDragEnded(cardsEvent)
    }
  }, [cardLists])

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

  const loadBoard = (boardId: number | string | undefined) => {
    return new Promise<void>((resolve) => {
      boardService
        .getBoard(boardId)
        .then((data: { team: Team; board: Board; members: Member[]; cardLists: CardList[] }) => {
          setTeam({ ...team, name: data.team ? data.team.name : '' })
          setBoard({ id: data.board.id, name: data.board.name, personal: data.board.personal })

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

            setCardLists((oldValue) => [...oldValue, {
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

  const closeCardWindow = () => {
    $('#cardModal').modal('hide')
  }

  const addCard = (cardListIndex: number) => {
    if (!cardLists[cardListIndex].cardForm.title.trim()) return

    const card = {
      boardId: board.id,
      cardListId: cardLists[cardListIndex].id,
      title: cardLists[cardListIndex].cardForm.title,
      position: cardLists[cardListIndex].cards.length + 1
    }
    cardService.add(card)
      .then((savedCard) => {
        appendCardToList(cardListIndex, savedCard)
        resetCard()
        focusCardForm(cardLists[cardListIndex])
      })
      .catch((error) => {
        notify.error(error.message)
      })
  }

  const appendCardToList = (cardListIndex: number, card: Card) => {
    const existingIndex = cardLists[cardListIndex].cards.findIndex((existingCard) => existingCard.id === card.id)
    if (existingIndex === -1) {
      setCardLists(oldCardLists => {
        const temp = [...oldCardLists]
        temp[cardListIndex].cards.push({
          id: card.id,
          title: card.title,
          coverImage: ''
        })
        return temp
      })
    }
  }

  useEffect(() => {
    setCardLists(cardLists)
  }, [cardLists])

  const focusCardForm = (cardList: AddedCardList) => {
    $('#cardTitle' + cardList.id).trigger('focus')
  }

  const onSubmit = (title : string, cardListIndex: number) => {
    setCardLists(oldCardLists => {
      const temp = [...oldCardLists]
      temp[cardListIndex].cardForm.title = title
      return temp
    })
    addCard(cardListIndex)
  }

  const onKeyDownEnter = (e: KeyboardEvent<HTMLTextAreaElement>, cardListIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit(getValues('title'), cardListIndex)
    }
  }

  function addCardList(formData: { name: string }) {
    const cardList = {
      boardId: board.id,
      name: formData.name,
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
    const fromListId = event.from.id
    const toListId = event.to.id
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

  const openAddCardForm = async (cardList: AddedCardList, cardListIndex: number) => {
    await setCardLists(oldCardLists => {
      const temp = [...oldCardLists]
      temp.map(oldCardList => oldCardList.cardForm.open = false)
      temp[cardListIndex].cardForm.open = true
      return temp
    })
    focusCardForm(cardList)
  }

  const closeAddCardForm = (cardListIndex: number) => {
    setCardLists(cardLists => {
      const temp = [...cardLists]
      temp[cardListIndex].cardForm.open = false
      return temp
    })
  }

  const openAddListForm = () => {
    setAddListForm(true)
  }

  useLayoutEffect(() => {
    $('#cardListName').trigger('focus')
  },[addListForm])

  const closeAddListForm = () => {
    setAddListForm(false)
    resetCardList()
  }

  const onMemberAdded = (member: { id: number; name: string; shortName: string }) => {
    members.push(member)
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
      setAddListForm(false)
    }
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

  function updateCardDescription({ cardId, description } : { cardId: number; description: string }) {
    setCardLists(oldValue => {
      const temp = [...oldValue]
      temp.map(cl => {
        cl.cards.map(c => {
          if (c.id === cardId) {
            c.description = description
          }
        })
        return cl
      })
      return temp
    })
  }

  function updateCardTitle({ cardId, title }: { cardId: number; title: string }) {
    setCardLists(oldValue => {
      const temp = [...oldValue]
      temp.map(cl => {
        cl.cards.map(c => {
          if (c.id === cardId) {
            c.title = title
          }
        })
        return cl
      })
      return temp
    })
  }

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
                    onEnd={() => {
                      isCardListsSortingRef.current = true
                    }}
                  >
                    {cardLists.map((cardList, cardListIndex) => (
                      <div key={cardList.id} className='list-wrapper'>
                        <div className='list'>
                          <div className='list-header'>{cardList.name}</div>
                          <ReactSortable
                            list={cardList.cards}
                            setList={(newValue) => {
                              setCardLists((sourceList) => {
                                const tempList = [...sourceList]
                                tempList[cardListIndex].cards = newValue
                                return tempList
                              })
                            }}
                            className='cards'
                            draggable='.card-item'
                            group='cards'
                            ghostClass='ghost-card'
                            animation={0}
                            scrollSensitivity={100}
                            touchStartThreshold={20}
                            id={`${cardList.id}`}
                            onEnd={(event) => {
                              isCardsSortingRef.current = true
                              setCardsEvent(event)
                            }}
                          >
                            <>
                              <CardComponent cardList={cardList} />
                              {cardList.cardForm.open && (
                                <div className='add-card-form-wrapper'>
                                  <form
                                    className='add-card-form'
                                    onSubmit={cardHandleSubmit(({ title }) => onSubmit(title, cardListIndex))}
                                  >
                                    <div className='form-group'>
                                      <textarea
                                        id={'cardTitle' + cardList.id}
                                        {...cardRegister('title', { required: true })}
                                        className='form-control'
                                        placeholder='Type card title here'
                                        onKeyDown={(e) => onKeyDownEnter(e, cardListIndex)}
                                      />
                                    </div>
                                    <button type='submit' className='btn btn-sm btn-primary'>
                                    Add
                                    </button>
                                    <button
                                      type='button'
                                      className='btn btn-sm btn-link btn-cancel'
                                      onClick={() => closeAddCardForm(cardListIndex)}
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
                              onClick={() => openAddCardForm(cardList, cardListIndex)}
                            >
                              + Add a card
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className='list-wrapper add-list'>
                      {!addListForm && (
                        <div className='add-list-button' onClick={openAddListForm}>
                          + Add a list
                        </div>
                      )}
                      {addListForm === true && (
                        <form className='add-list-form' onSubmit={cardListHandleSubmit(addCardList)}>
                          <div className='form-group'>
                            <input
                              id='cardListName'
                              {...cardListRegister('name', { required: true })}
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
            onDescriptionChanged={(data) => updateCardDescription(data)}
            onTitleChanged={(data) => updateCardTitle(data)}
          />
        </div>
      )}
    </>
  )
}

export default BoardPage

function CardComponent({ cardList } : {cardList : AddedCardList}) {

  const navigate = useNavigate()

  const openCard = (card: any) => {
    const cardTitle = card.title.toLowerCase().trim().replace(/\s/g, '-')
    navigate(`/card/${card.id}/${cardTitle}`)
  }

  const component = cardList.cards.map((card) =>{
    return (
      <div
        key={card.id}
        className='card-item'
        onClick={() => openCard(card)}
      >
        {card.coverImage.length > 0 && (
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
