import SockJS from 'sockjs-client'
import globalBus from './event-bus'
import EventBus from './eventbus/EventBus'

class RealTimeClient {
  private authenticated: boolean
  private serverUrl: string | null
  private token: string | null
  private socket: any
  private triedAttempts: number
  private subscribeQueue: any
  private unsubscribeQueue: any
  private $bus: any
  private loggedOut: boolean

  constructor() {
    this.authenticated = false
    this.serverUrl = null
    this.token = null
    this.socket = null
    this.triedAttempts = 0
    this.subscribeQueue = {}
    this.unsubscribeQueue = {}
    this.$bus = new EventBus()
    this.loggedOut = false
  }

  init (serverUrl: string, token: string) {
    if (this.authenticated) {
      console.warn('[RealTimeClient] WS connection already authenticated.')
      return
    }
    console.log('[RealTimeClient] Initializing')
    this.serverUrl = serverUrl
    this.token = token
    this.connect()
  }

  logout () {
    console.log('[RealTimeClient] Logging out')
    this.subscribeQueue = {}
    this.unsubscribeQueue = {}
    this.authenticated = false
    this.loggedOut = true
    this.socket && this.socket.close()
  }

  connect () {
    console.log('[RealTimeClient] Connecting to ' + this.serverUrl)
    this.socket = new SockJS(this.serverUrl + '?token=' + this.token, null, { transports : ['websocket'] })
    this.socket.onopen = () => {
      this.authenticated = true
      this._onConnected()
    }
    this.socket.onmessage = (event: { data: string }) => {
      this._onMessageReceived(event)
    }
    this.socket.onerror = (error: any) => {
      this._onSocketError(error)
    }
    this.socket.onclose = (event: any) => {
      this._onClosed(event)
    }
  }

  _onConnected () {
    this.triedAttempts = 0
    // globalBus.$emit('RealTimeClient.connected', null)
    console.log('[RealTimeClient] Connected')

    this._processQueues()
  }

  _processQueues () {
    console.log('[RealTimeClient] Processing subscribe/unsubscribe queues')

    const subscribeChannels = Object.keys(this.subscribeQueue)
    subscribeChannels.forEach(channel => {
      const handlers = this.subscribeQueue[channel]
      handlers.forEach((handler: any) => {
        this.subscribe(channel, handler)
        this._removeFromQueue(this.subscribeQueue, channel, handler)
      })
    })

    const unsubscribeChannels = Object.keys(this.unsubscribeQueue)
    unsubscribeChannels.forEach(channel => {
      const handlers = this.unsubscribeQueue[channel]
      handlers.forEach((handler: any) => {
        this.unsubscribe(channel, handler)
        this._removeFromQueue(this.unsubscribeQueue, channel, handler)
      })
    })
  }

  subscribe (channel: string, handler: any) {
    if (!this._isConnected()) {
      this._addToSubscribeQueue(channel, handler)
      return
    }
    const message = {
      action: 'subscribe',
      channel
    }
    this._send(message)

    /**
     * 채널 이름으로 함수 등
     */
    this.$bus.$on(this._channelEvent(channel), handler)
    console.log('[RealTimeClient] Subscribed to channel ' + channel)
  }

  unsubscribe (channel: string, handler: any) {
    if (this.loggedOut) {
      return
    }

    if (!this._isConnected()) {
      this._addToSubscribeQueue(channel, handler)
      return
    }

    const message = {
      action: 'unsubscribe',
      channel
    }
    this._send(message)
    this.$bus.$off(this._channelEvent(channel))
    // this.$bus.$off(this._channelEvent(channel), handler)
    console.log('[RealTimeClient] Unsubscribed from channel ' + channel)
  }

  _removeFromQueue (queue: { [x: string]: any }, channel: string, handler: any) {
    const handlers = queue[channel]
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  _isConnected () {
    return this.socket && this.socket.readyState === SockJS.OPEN
  }

  _addToSubscribeQueue (channel: string, handler: any) {
    console.log('[RealTimeClient] Adding channel subscribe to queue. Channel: ' + channel)
    this._removeFromQueue(this.unsubscribeQueue, channel, handler)
    const handlers = this.subscribeQueue[channel]
    if (!handlers) {
      this.subscribeQueue[channel] = [handler]
    } else {
      handlers.push(handler)
    }
  }

  _send (message: { action: string; channel: string }) {
    this.socket.send(JSON.stringify(message))
  }

  _channelEvent (channel: string) {
    return 'channel:' + channel
  }

  _onMessageReceived (event: { data: string }) {
    const message = JSON.parse(event.data)
    console.log('[RealTimeClient] Received message', message)

    if (message.channel) {
      this.$bus.$emit(this._channelEvent(message.channel), JSON.parse(message.payload))
    }
  }

  _onSocketError (error: any) {
    console.error('[RealTimeClient] Socket error', error)
  }

  _onClosed (event: any) {
    console.log('[RealTimeClient] Received close event', event)
    if (this.loggedOut) {
      console.log('[RealTimeClient] Logged out')
      globalBus.$emit('RealTimeClient.loggedOut', null)
    } else {
      if (this.triedAttempts > 30) {
        console.log('[RealTimeClient] Logged out')
        return
      }
      console.log('[RealTimeClient] Disconnected')
      globalBus.$emit('RealTimeClient.disconnected', null)

      setTimeout(() => {
        this.triedAttempts++
        console.log('[RealTimeClient] Reconnecting')
        globalBus.$emit('RealTimeClient.reconnecting', null)
        this.connect()
      }, 1000)
    }
  }
}

export default new RealTimeClient()