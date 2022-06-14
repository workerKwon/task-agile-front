import { useState } from 'react'
import boardService from '../services/board/board'
import { useForm } from 'react-hook-form'

const CreateBoardModal = (props: { onCreated: (number: number) => void; teamId: number }) => {
  const [errorMessage, setErrorMessage] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<{name: string, description: string}>()

  const saveBoard = (data: {name: string, description: string}) => {
    // this.$v.$touch()
    // if (this.$v.$invalid) {
    //   return
    // }
    const savedBoard = {
      teamId: props.teamId,
      name: data.name,
      description: data.description
    }

    boardService
      .create(savedBoard)
      .then((createdBoard: Board) => {
        // TODO
        //  this.$store.dispatch('addBoard', createdBoard)
        props.onCreated(createdBoard.id)
        close()
      })
      .catch((error: { message: string }) => {
        setErrorMessage(error.message)
      })
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
                    {...register('name', { required: true })}
                    id='boardNameInput'
                    type='text'
                    className='form-control'
                    placeholder='Board name'
                    maxLength={128}
                  />
                  {
                    errors.name &&
                    <div className='field-error'>
                      <div className='error-block'>
                        Name is required
                      </div>
                    </div>
                  }

                </div>
                <div className='form-group'>
                  <textarea
                    {...register('description', { required: true })}
                    className='form-control'
                    placeholder='Add board description here'
                  />
                  {
                    errors.description &&
                    <div className='field-error'>
                      <div className='error-block'>
                        Description is required
                      </div>
                    </div>
                  }

                </div>
              </div>
              <div className='modal-footer'>
                <button type='submit' className='btn btn-primary'>
                  Create
                </button>
                <button type='button' className='btn btn-default btn-cancel' onClick={close}>
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
