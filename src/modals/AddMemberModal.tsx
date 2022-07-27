import { useEffect, useState } from 'react'
import boardService from '../services/board/board'
import $ from 'jquery'
import { useForm } from 'react-hook-form'
import './stylesheet/addmembermodal.scoped.scss'

const AddMemberModal = (props: { boardId: number; onAdded: (member: any) => void }) => {

  const [errorMessage, setErrorMessage] = useState('')
  const { register, reset, handleSubmit, formState: { errors } } = useForm<{usernameOrEmailAddress: string}>()

  useEffect(() => {
    $('#addMemberModal').on('shown.bs.modal', () => {
      $('#usernameOrEmailAddressInput').trigger('focus')
    })
  }, [])

  const addMember = ({ usernameOrEmailAddress }: {usernameOrEmailAddress: string}) => {
    boardService.addMember(props.boardId, usernameOrEmailAddress)
      .then((member) => {
        props.onAdded(member)
        close()
      }).catch(error => {
        setErrorMessage(error.message)
      })
  }

  const close = () => {
    reset()
    setErrorMessage('')
    $('#addMemberModal').modal('hide')
  }
  return (
    <>
      <form onSubmit={handleSubmit(addMember)}>
        <div
          id="addMemberModal"
          className="modal"
          tabIndex={-1}
          role="dialog"
          data-backdrop={'static'}
        >
          <div
            className="modal-dialog"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Member</h5>
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
                {errorMessage.length > 0 &&
                  <div className="alert alert-danger failed">{ errorMessage }</div>
                }
                <div className="form-group">
                  <input
                    id="usernameOrEmailAddressInput"
                    {...register('usernameOrEmailAddress', { required: { value:true, message: 'This is required' }, maxLength: 128 })}
                    type="text"
                    className="form-control"
                    placeholder="Username or email address"
                  />
                  <div className='field-error'>
                    <div className='error-block'>
                      {errors.usernameOrEmailAddress?.message}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                >Add
                </button>
                <button
                  type="button"
                  className="btn btn-default btn-cancel"
                  onClick={close}
                >Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}

export default AddMemberModal
