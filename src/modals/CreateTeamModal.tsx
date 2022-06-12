import { useState } from 'react'
import teamService from '../services/team/team'
import $ from 'jquery'
import { useRecoilState } from 'recoil'
import { teamsState } from '../recoil/state'

function CreateTeamModal() {
  const [errorMessage, setErrorMessage] = useState('')

  const [team, setTeam] = useState({ name: '' })

  const [teams, setTeams] = useRecoilState(teamsState)


  const saveTeam = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    // this.$v.$touch()
    //   if (this.$v.$invalid) {
    //     return
    //   }
      teamService.create(team).then((createdTeam) => {
        setTeams([...teams, createdTeam])
        close()
      }).catch(error => {
        setErrorMessage(error.message)
      })
  }

  const onChangeTeamName = (e: { target: { value: string } }) => {
    const { value } = e.target
    setTeam({
      name: value
    })
  }

  const close = () => {
    // this.$v.$reset()
      setTeam({name: ''})
      setErrorMessage('')
      $('#createTeamModal').modal('hide')
  }

  return (
  <>
  <form onSubmit={saveTeam}>
    <div
      id="createTeamModal"
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
              Create Team
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
            {
              errorMessage && 
              <div className="alert alert-danger failed"
            >
              { errorMessage }
            </div>
            }
            <div className="form-group">
              <input
                id="teamNameInput"
                name="teamName"
                value={team.name}
                onChange={onChangeTeamName}
                type="text"
                className="form-control"
                placeholder="Team name"
                maxLength={128}
              />
              <div
                // v-if="$v.team.name.$dirty"
                className="field-error"
              >
                <div
                  // v-if="!$v.team.name.required"
                  className="error"
                >
                  Name is required
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

export default CreateTeamModal