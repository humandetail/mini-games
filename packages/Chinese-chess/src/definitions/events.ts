export default {
  global: {
    connection: 'connection',
    disconnect: 'disconnect',
    // 用户主动注册进入
    register: 'user:register'
  },
  user: {
    update: 'user:update'
  },
  room: {
    list: 'room:list',
    context: 'room:context',
    create: 'room:create',
    join: 'room:join',
    leave: 'room:leave',
    info: 'room:info',
    seatRequest: 'room:seat:request',
    seatResponse: 'room:seat:response',
    chat: 'room:chat'
  },
  error: {
    roomMax: 'error:room:max',
    roomNotFound: 'error:room:not-found',
    roomProcess: 'error:room:process'
  },
  game: {
    ready: 'game:ready',
    start: 'game:start',
    change: 'game:change',
    pointer: 'game:pointer:click'
  },
  client: {
    connect: 'connect',
    disconnect: 'disconnect'
  }
}
