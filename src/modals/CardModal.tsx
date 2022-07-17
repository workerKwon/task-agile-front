import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { KeyboardEvent } from 'react'

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

  function changeCardTitle(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  function showEditDescription() {

  }

  function changeCardDescription() {

  }

  function cancelEditDescription() {

  }

  function addComment() {

  }

  return <>
    <div
      id="cardModal"
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
            <FontAwesomeIcon
              icon="window-maximize"
              className="card-title-icon"
            />
            <h4 className="modal-title">
              <textarea
                id="cardTitle"
                value={title}
                className="auto-size"
                onKeyDown={(e) => changeCardTitle(e)}
              // keydown.enter.prevent="changeCardTitle"
              />
              <div className="meta-card-list">
              in list {props.cardList.name}
              </div>
            </h4>
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
            <div className="card-container">
              {assignees.length > 0 &&
                <div className="wrapper assignee-wrapper">
                  <div className="wrapper-body" />
                </div>
              }
              <div className="wrapper description-wrapper">
                <div className="wrapper-body">
                  {!editingDescription &&
                    <div
                      className="empty-tip"
                      onClick={showEditDescription}
                    >
                      Description <FontAwesomeIcon icon="pencil-alt" />
                    </div>
                  }
                  {editingDescription === true &&
                  <form
                    className="description-form"
                    onSubmit={changeCardDescription}
                  >
                    <div className="form-group">
                      <textarea
                        id="cardDescription"
                        value={description}
                        className="auto-size"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
              Save
                    </button>
                    <span
                      className="btn btn-link btn-cancel"
                      onClick={cancelEditDescription}
                    >Cancel</span>
                    <span className="format-support float-right">Support Markdown</span>
                  </form>
                  }
                  {(description && !editingDescription) &&
                    <div
                      className="description"
                      htmlFor="descriptionHtml"
                    />
                  }
                </div>
              </div>
              {(attachments.length || uploadingCount) &&
              <div className="wrapper attachments-wrapper">
                <h5>
                  <FontAwesomeIcon
                    icon="paperclip"
                    className="icon"
                  /><span>Attachments</span>
                </h5>
                <div className="wrapper-body">
                  {uploadingCount &&
                    <div className="uploading">
                      <FontAwesomeIcon
                        icon="spinner"
                        className="fa-spin"
                        spin
                      />Uploading...
                    </div>
                  }
                  <ul className="list-unstyled">
                    <li
                      v-for="attachment in cardAttachments"
                      key={attachment.id}
                      className="media"
                    >
                      <div className="mr-3">
                        {attachment.previewUrl &&
                          <div className="preview thumbnail">
                            <img src={attachment.previewUrl} />
                          </div>
                        }
                        {!attachment.previewUrl &&
                          <div className="preview file-type">
                            {attachment.fileType}
                          </div>
                        }
                      </div>
                      <div className="media-body">
                        <h6 className="mt-0 mb-1">
                          <a
                            href={attachment.fileUrl}
                            target="_blank" rel="noreferrer"
                          >{attachment.fileName}</a>
                        </h6>
                        <p className="when">
            Added {when(attachment.createdDate)}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              }
              <div className="wrapper comment-form-wrapper">
                <h5>
                  <FontAwesomeIcon
                    icon="comment"
                    className="icon"
                  /><span>Add Comment</span>
                </h5>
                <div className="wrapper-body">
                  <form
                    className="comment-form"
                    onSubmit={addComment}
                  >
                    <div className="form-group">
                      <textarea
                        value={newComment}
                        placeholder="Add a comment here"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!newComment}
                    >
      Save
                    </button>
                  </form>
                </div>
              </div>
              <div className="wrapper activities-wrapper">
                <h5>
                  <FontAwesomeIcon
                    icon="list-ul"
                    className="icon"
                  />
                  <span>Activities</span>
                </h5>
                <div className="wrapper-body">
                  <div
                    v-for="activity in cardActivities"
                    key={activity.id}
                    className="activity"
                  >
                    <div><strong>{activity.user.name}</strong> <span className="when">{activity.when} ago</span></div>
                    <div
                      className={'detail'}
                      className={activity.type}
                    >
                      {activity.actionDetail}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-controls">
              <h5>Add to Card</h5>
              <div className="control">
                <FontAwesomeIcon
                  icon="user"
                  className="icon"
                /> Members
              </div>
              <div className="control">
                {/* <uploader */}
                {/*   id="cardAttachment" */}
                {/* url={attachmentUploadUrl} */}
                {/* icon="paperclip" */}
                {/* label="Attachment" */}
                {/* uploading={onUploadingAttachment} */}
                {/* progress={onUploadingProgressUpdated} */}
                {/* failed={onAttachmentUploadFailed} */}
                {/* uploaded={onAttachmentUploaded} */}
                {/* /> */}
              </div>
              <h5 className="actions">
      Actions
              </h5>
              <div className="control">
                <FontAwesomeIcon
                  icon="archive"
                  className="icon"
                /> Archive
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default CardModal
