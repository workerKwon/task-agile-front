import { useEffect, useState } from 'react'
import boardService from '../services/board/board'
import { useForm } from 'react-hook-form'
import $ from 'jquery'
import { useRecoilState } from 'recoil'
import { boardsState } from '../recoil/state'

const CreateBoardModal = (props: { onCreated: (number: number) => void; teamId: number }) => {
  const [errorMessage, setErrorMessage] = useState('')

  const [boardState, setBoardState] = useRecoilState(boardsState)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<{name: string, description: string}>()

  useEffect(() => {
    $('#createBoardModal').on('shown.bs.modal', () => {
      $('#boardNameInput').trigger('focus')
    })
  }, [])

  const saveBoard = (data: {name: string, description: string}) => {
    const board = {
      teamId: props.teamId,
      name: data.name,
      description: data.description
    }

    boardService.create(board)
      .then((createdBoard: Board) => {
        setBoardState([...boardState, createdBoard])
        props.onCreated(createdBoard.id)
        close()
      })
      .catch((error: { message: string }) => {
        setErrorMessage(error.message)
      })
  }

  function close () {
    reset({
      name: '',
      description: ''
    })
    setErrorMessage('')
    $('#createBoardModal').modal('hide')
  }

  return (
    <>
      <form onSubmit={handleSubmit(saveBoard)}>
        <div
          id='createBoardModal'
          className='modal'
          tabIndex={-1}
          role='dialog'
          data-backdrop='static'
        >
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Create Board</h5>
                <button type='button' className='close' aria-label='Close' onClick={close}>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                {
                  errorMessage &&
                  <div className='alert alert-danger failed'>
                    { errorMessage }
                  </div>
                }
                <div className='form-group'>
                  <input
                    {...register('name', { required: { value: true, message: 'Name is required' } })}
                    id='boardNameInput'
                    type='text'
                    className='form-control'
                    placeholder='Board name'
                    maxLength={128}
                  />
                  <div className='field-error'>
                    <div className='error-block'>
                      {errors.name?.message}
                    </div>
                  </div>
                </div>
                <div className='form-group'>
                  <textarea
                    {...register('description', { required: { value: true, message: 'Description is required' } })}
                    className='form-control'
                    placeholder='Add board description here'
                  />
                  <div className='field-error'>
                    <div className='error-block'>
                      {errors.description?.message}
                    </div>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button type='submit' className='btn btn-primary'>
                  Create
                </button>
                <button type='button' className='btn btn-default btn-cancel' onClick={() => close()}>
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
