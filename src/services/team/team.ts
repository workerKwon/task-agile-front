import axios from 'axios'

type createdTeam = {
    name: string
}

export default {
  create(team: createdTeam) {
    return new Promise<Team>((resolve, reject) => {
      axios.post('/teams', team)
        .then(({ data }) => {
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}