import { useState } from 'react'
import teamService from '../services/team/team'
import $ from 'jquery'
import { useRecoilState } from 'recoil'
import { teamsState } from '../recoil/state'
import { useForm } from 'react-hook-form'

function CreateTeamModal() {
  const [errorMessage, setErrorMessage] = useState('')

  const { register, handleSubmit, formState: { errors }, resetField } = useForm<{name: string}>()

  const [teams, setTeams] = useRecoilState(teamsState)

  const saveTeam = (data: { name: string}) => {
    // this.$v.$touch()
    //   if (this.$v.$invalid) {
    //     return
    //   }
    teamService
      .create(data)
      .then((createdTeam) => {
        setTeams([...teams, createdTeam])
        close()
      })
      .catch((error) => {
        setErrorMessage(error.message)
      })
  }

  const close = () => {
    // this.$v.$reset()
    resetField('name')
    setErrorMessage('')
    $('#createTeamModal').modal('hide')
  }

  return (
    <>
      <form onSubmit={handleSubmit(saveTeam)}>
        <div
          id='createTeamModal'
          className='modal'
          tabIndex={-1}
          role='dialog'
          data-backdrop='static'
        >
          <div className='modal-dialog' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Create Team</h5>
                <button type='button' className='close' aria-label='Close' onClick={close}>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                {errorMessage && <div className='alert alert-danger failed'>{errorMessage}</div>}
                <div className='form-group'>
                  <input
                    {...register('name',{ required: { value: true, message: 'Name is required' } })}
                    id='teamNameInput'
                    type='text'
                    className='form-control'
                    placeholder='Team name'
                    maxLength={128}
                  />
                  <div className='field-error'>
                    <div className='error-block'>
                      {errors.name?.message}
                    </div>
                  </div>
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

export default CreateTeamModal
