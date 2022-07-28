export default class EventBus {
  private readonly bus: any
  
  constructor() {
    this.bus = {}
  }
  
  $off(type: string) {
    delete this.bus[type]
  }
  
  $on(type: string, callback: any) {
    this.bus[type] = callback
  }
  
  $emit(type: string, data: any) {
    this.bus[type](data)
  }
}