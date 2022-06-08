import * as Noty from 'noty'

const showError = function(errorMessage: string) {
  new Noty({
    type: 'error',
    theme:'relax',
    closeWith: ['click', 'button'],
    text: errorMessage
  }).show()
}

const closeAll = function() {
  Noty.closeAll()
}

export default {
  error: showError,
  closeAll
}