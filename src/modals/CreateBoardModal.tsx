import { useState } from 'react'
import boardService from '../services/board/board'

const CreateBoardModal = (props: { onCreated: (number: number) => void, teamId: number }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [board, setBoard] = useState({
    name: '',
    description: ''
  })

  const saveBoard = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // this.$v.$touch()
    // if (this.$v.$invalid) {
    //   return
    // }
    const savedBoard = {
      teamId: props.teamId,
      name: board.name,
      description: board.description
    }
    boardService.create(savedBoard).then((createdBoard: Board) => {
      // TODO
      //  this.$store.dispatch('addBoard', createdBoard)
      props.onCreated(createdBoard.id)
      close()
    }).catch((error: { message: string }) => {
      setErrorMessage(error.message)
    })
  }



  const onChangeBoardName = (e: { target: { value: string, name: string } }) => {
    const {value, name} = e.target
    setBoard({
      ...board,
      [name]: value
    })
  }

  return (
    <>
    <form onSubmit={saveBoard}>
    <div
      id="createBoardModal"
      className="modal"
      tabIndex={-1}
      role="dialog"
      data-backdrop="static"
    >
      <div
        className="modal-dialog"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              Create Board
            </h5>
            <button
              type="button"
              className="close"
              aria-label="Close"
            onClick={close}
            >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          <div
            v-show="errorMessage"
            className="alert alert-danger failed"
          >
            { errorMessage }
          </div>
          <div className="form-group">
            <input
              id="boardNameInput"
              name="name"
              value={board.name}
              onChange={onChangeBoardName}
              type="text"
              className="form-control"
              placeholder="Board name"
              maxLength={128}
            />
              <div
                v-if="$v.board.name.$dirty"
                className="field-error"
              >
                <div
                  v-if="!$v.board.name.required"
                  className="error"
                >
                  Name is required
                </div>
              </div>
          </div>
          <div className="form-group">
              <textarea
                v-model="board.description"
                className="form-control"
                placeholder="Add board description here"
              />
            <div
              v-if="$v.board.description.$dirty"
              className="field-error"
            >
              <div
                v-if="!$v.board.description.required"
                className="error"
              >
                Description is required
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="submit"
            className="btn btn-primary"
          >
            Create
          </button>
          <button
            type="button"
            className="btn btn-default btn-cancel"
          onClick={close}
          >
          Cancel
        </button>
      </div>
    </div>
    </div>
</div>
</form>
    </>
  )
}



export default CreateBoardModal