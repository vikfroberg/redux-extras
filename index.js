const defaultReducer = (state, action) => action.payload
const isFunc = fn => typeof fn === 'function'

export const createAction = (type, payloadCreator) => {
  const finalPayloadCreator = typeof payloadCreator === 'function'
    ? payloadCreator
    : p => p

  const actionCreator = (...args) => {
    const action = {
      type,
    }

    const payload = finalPayloadCreator(...args)
    if (payload !== null && payload !== undefined) {
      action.payload = payload
    }

    return action
  }

  actionCreator.toString = () => type.toString()

  return actionCreator
}

export const handleAction = (actionType, reducer, initialState) => {
  const finalInitialState = isFunc(reducer)
    ? initialState
    : reducer

  const finalReducer = isFunc(reducer)
    ? reducer
    : defaultReducer

  return (state = finalInitialState, action) => {
    if (actionType.toString() === action.type.toString()) {
      return finalReducer(state, action)
    }

    return state
  }
}

export const handleActions = (handlers, initialState) => {
  const reducers = Object.keys(handlers).map(type => handleAction(type, handlers[type]))
  const reducer = (initialState, action) => 
    reducers.reduce((prevState, reducer) => reducer(reducedState, action), initialState)

  return (state = defaultState, action) => reducer(state, action)
}
