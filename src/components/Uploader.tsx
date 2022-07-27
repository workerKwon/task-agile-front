import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { useEffect } from 'react'
import $ from 'jquery'
import 'jquery-ui/ui/widget'
import 'blueimp-file-upload/js/jquery.fileupload'
import 'blueimp-file-upload/js/jquery.iframe-transport'
import './stylesheet/uploader.scoped.scss'

function Uploader(props: {
  id: string,
  url: string, icon: IconProp, label: string,
  uploading: (data: any) => void, progress: (data: any) => void, failed: (data: any) => void, uploaded: (data: any) => void
}) {

  useEffect(() => {
    if (!props.url) {
      return
    }
    $('#' + props.id).fileupload({
      url: props.url,
      dataType: 'json',
      add: (e, data) => {
        props.uploading(data.files[0])
        data.submit()
      },
      fail: (e, data) => {
        props.failed(data.jqXHR.responseJSON.message)
      },
      done: (e, data) => {
        props.uploaded(data.result)
      },
      progress: (e, data) => {
        if (data.loaded && data.total) {
          const progress = parseInt(String(data.loaded / data.total * 100), 10)
          props.progress(progress)
        }
      }
    })
  }, [props.url])

  return (
    <>
      <div className="fileinput-button">
        {props.icon !== null &&
          <FontAwesomeIcon
            icon={props.icon}
            className="icon"
          />
        }
        { props.label }
        <input
          id={props.id}
          type="file"
          name="file"
          multiple
        />
      </div>
    </>
  )
}

export default Uploader
