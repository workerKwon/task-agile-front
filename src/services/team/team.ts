import api from '../../axios/api'

type createdTeam = {
    name: string
}

export default {
    create(team: createdTeam) {
        return new Promise<Team>((resolve, reject) => {
            api.post('/teams', team)
            .then(({data}) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
        })
    }
}