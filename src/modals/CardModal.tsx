const CardModal = (props: {
  card: { cardListId?: number }
  cardList: {
    id: number
    name: string
    cards: { id: number; title: string; coverImage: string }[]
    cardForm: { title: string }
  }
  board: { id: number; name: string; personal: boolean }
  members: { id: number; name: string; shortName: string }[]
  onCoverImageChanged: () => void
}) => {
  props
  return <></>
}

export default CardModal
