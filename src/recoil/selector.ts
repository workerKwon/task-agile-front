import { selector } from 'recoil'
import myService from '../services/me/me'
// import { teamsState } from './state'

export const myDataSelector = selector({
  key: 'myDataSelector',
  get: async () => {
    const data = await myService.getMyData()
    // console.log(data)
    return data
  }
  // set: ({ get }, newValue) => {
  //   console.log(get(teamsState))
  //   console.log(newValue)
  // }
})