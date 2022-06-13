import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PageHeader from '../components/PageHeader'
import AddMemberModal from '../modals/AddMemberModal'
import CardModal from '../modals/CardModal'
import { FormEvent, KeyboardEvent, useState } from 'react'
import { ReactSortable } from 'react-sortablejs'
import { useRecoilState } from 'recoil'
import { cardListsState, membersState } from '../recoil/state'

const BoardPage = () => {
  const [board] = useState({ id: 0, name: '', personal: false, description: '' })
  const [team] = useState({ name: '' })

  const [members] = useRecoilState(membersState)

  const [cardLists] = useRecoilState(cardListsState)

  const openedCard = useState<Card>({
    id: 0,
    title: '',
    coverImage: ''
  })[0]

  const [focusedCardList] = useState<CardList>({ cardForm: { id: 0, title: '', coverImage:''}, cards: [], id: 0, name: '' })

  const addCard = (cardList: CardList) => {
    cardList
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>, cardList: CardList) => {
    e.preventDefault()
    addCard(cardList)
  }

  const onKeyDownEnter = (e: KeyboardEvent<HTMLTextAreaElement>, cardList: CardList) => {
    e.preventDefault()
    if(e.key === 'enter') {
      cardList
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

  const openAddCardForm = (cardList: CardList) => {
    openCard(cardList)
  }

  const closeAddCardForm = (cardList: CardList) => {
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
