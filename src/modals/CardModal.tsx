import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { KeyboardEvent, useEffect, useMemo, useState } from 'react'
import autosize from 'autosize'
import cardService from '../services/card/card'
import notify from '../utils/notify'
import { formatDistance } from 'date-fns'
import showdown from 'showdown'
import './stylesheet/cardmodal.scss'
import $ from 'jquery'

showdown.setOption('strikethrough', true)
showdown.setOption('tables', true)

interface CardActivity {
  type: string
  user: any
  actionDetail: string
  when: string
  createdDate: any
}

const CardModal = (props: {
  card: Card
  cardList: {
    id: number
    name: string
    cards: { id: number; title: string; coverImage: string }[]
    cardForm: { title: string }
  }
  board: { id: number; name: string; personal: boolean }
  members: { id: number; name: string; shortName: string }[]
  onCoverImageChanged: () => void
  onDescriptionChanged: ({ cardId, description }: {cardId: number, description: string}) => void
  onTitleChanged: ({ cardId, title } : {cardId: number, title: string}) => void
}) => {
  const markdownConverter = new showdown.Converter()

  const [editingDescription, setEditingDescription] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [title, setTitle] = useState('')
  const [assignees] = useState([])
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [uploadingCount, setUploadingCount] = useState(0)
  const [cardId, setCardId] = useState(0)

  const computedDescriptionHtml = useMemo(() => {
    if (!description) {
      return ''
    }
    return markdownConverter.makeHtml(description)
  }, [description])

  const computedCardAttachments = useMemo(() => {
    const cardAttachments: Attachment[] = []
    attachments.forEach(attachment => {
      cardAttachments.push(attachment)
    })
    return cardAttachments.sort((prev, curr) => {
      return curr.createdDate - prev.createdDate
    })
  }, [attachments])

  useEffect(() => {
    setCardId(props.card.id)
    setTitle(props.card.title)
    setDescription(props.card.description)
  }, [props.card])

  useEffect(() => {
    setTimeout(() => {
      autosize($('.auto-size'))
    }, 0)
    $('#cardModal').on('show.bs.modal', () => {
      setTimeout(() => {
        autosize.update($('.auto-size'))
      }, 0)
      loadActivities()
      loadAttachments()
    })
  })

  function loadActivities () {
    cardService.getCardActivities(cardId).then(({ activities }) => {
      setActivities(activities)
    }).catch(error => {
      notify.error(error.message)
    })
  }

  function loadAttachments () {
    cardService.getCardAttachments(cardId).then(({ attachments }) => {
      setAttachments(attachments)
    }).catch(error => {
      notify.error(error.message)
    })
  }

  const computedCardActivities = useMemo(() => {
    if (!props.members.length || !activities.length) {
      return []
    }
    const userById: any = {}
    props.members.forEach(member => {
      userById[member.id] = member
    })
    const cardActivities: CardActivity[] = []
    const now = new Date()
    activities.forEach(activity => {
      const detail = JSON.parse(activity.detail)

      let actionDetail = ''
      if (activity.type === 'add-comment') {
        actionDetail = detail.comment
      } else if (activity.type === 'add-card') {
        actionDetail = 'Added this card'
      } else if (activity.type === 'add-attachment') {
        actionDetail = 'Added attachment ' + detail.fileName
      } else if (activity.type === 'change-card-description') {
        actionDetail = 'Changed card description'
      } else if (activity.type === 'change-card-title') {
        actionDetail = 'Changed card title'
      }

      cardActivities.push({
        user: userById[activity.userId],
        type: activity.type,
        actionDetail: actionDetail,
        when: formatDistance(new Date(activity.createdDate), now),
        createdDate: activity.createdDate
      })
    })
    cardActivities.sort((a1, a2) => {
      return a2.createdDate - a1.createdDate
    })
    return cardActivities
  }, [])

  function changeCardTitle(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      cardService.changeCardTitle(cardId, title).then(() => {
        props.onTitleChanged({ cardId, title })
        $('#cardModal').focus()
      }).catch(error => {
        notify.error(error.message)
      })
    }
  }

  function showEditDescription() {
    setEditingDescription(true)
  }

  useEffect(() => {
    $('#cardDescription').focus()
    autosize.update($('.auto-size'))
  }, [editingDescription])

  function changeCardDescription() {
    cardService.changeCardDescription(cardId, description).then(() => {
      props.onDescriptionChanged({ cardId, description })
      setEditingDescription(false)
    }).catch(error => {
      notify.error(error.message)
    })
  }

  function cancelEditDescription() {
    setEditingDescription(false)
  }

  function addComment() {
    cardService.addCardComment(cardId, newComment).then(commentActivity => {
      setNewComment('')
      setActivities([...activities, commentActivity])
    }).catch(error => {
      notify.error(error.message)
    })
  }

  function when(createdDate: any) {
    return formatDistance(new Date(createdDate), new Date())
  }

  function close() {
    $('#cardModal').modal('hide')
  }

  return <>
    <div
      id="cardModal"
      className="modal"
      tabIndex={-1}
      role="dialog"
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
                onChange={(e) => setTitle(e.target.value)}
                className="auto-size"
                onKeyDown={(e) => changeCardTitle(e)}
              />
              <div className="meta-card-list">
              in list {props.cardList.name}
              </div>
            </h4>
            <button
              type="button"
              className="close"
              aria-label="Close"
              onClick={() => close()}
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
                        onChange={(e) => setDescription(e.target.value)}
                        className="auto-size"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >Save
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
                      dangerouslySetInnerHTML={{ __html: computedDescriptionHtml }}
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
                    {computedCardAttachments.map((attachment) =>
                      (
                        <li key={attachment.id} className="media">
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
                            <p className="when">Added {when(attachment.createdDate)}</p>
                          </div>
                        </li>
                      )
                    )
                    }
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
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment here"
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!newComment}
                    >Save
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
                  {computedCardActivities.map((cardActivity, index) => (
                    <div
                      key={index}
                      className="activity"
                    >
                      <div><strong>{cardActivity.user.name}</strong> <span className="when">{cardActivity.when} ago</span></div>
                      <div
                        className={'detail ' + cardActivity.type}
                      >
                        {cardActivity.actionDetail}
                      </div>
                    </div>
                  )
                  )}
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
