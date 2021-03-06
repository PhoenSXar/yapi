import axios from 'axios'
// Actions
const FETCH_INTERFACE_COL_LIST = 'mock/interfaceCol/FETCH_INTERFACE_COL_LIST';
const FETCH_CASE_DATA = 'mock/interfaceCol/FETCH_CASE_DATA';
const FETCH_CASE_LIST = 'mock/interfaceCol/FETCH_CASE_LIST';
const SET_COL_DATA = 'mock/interfaceCol/SET_COL_DATA';
const FETCH_VARIABLE_PARAMS_LIST = 'mock/interfaceCol/FETCH_VARIABLE_PARAMS_LIST';

// Reducer
const initialState = {
  interfaceColList: [{
    _id: 0,
    name: '',
    uid: 0,
    project_id: 0,
    desc: '',
    add_time: 0,
    up_time: 0,
    caseList: [
      {}
    ]
  }],
  isShowCol: true,
  isRender: false,
  currColId: 0,
  currCaseId: 0,
  currCase: {},
  currCaseList: [],
  variableParamsList: []
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_INTERFACE_COL_LIST: {
      return {
        ...state,
        interfaceColList: action.payload.data.data
      }
    }
    case FETCH_CASE_DATA: {
      return {
        ...state,
        currCase: action.payload.data.data
      }
    }
    case FETCH_CASE_LIST: {
      return {
        ...state,
        currCaseList: action.payload.data.data
      }
    }

    case FETCH_VARIABLE_PARAMS_LIST: {
      return {
        ...state,
        variableParamsList: action.payload.data.data
      }
    }
    case SET_COL_DATA: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}


// Action Creators
export function fetchInterfaceColList(projectId) {
  return {
    type: FETCH_INTERFACE_COL_LIST,
    payload: axios.get('/api/col/list?project_id=' + projectId)
  }
}


export function fetchCaseData(caseId) {
  return {
    type: FETCH_CASE_DATA,
    payload: axios.get('/api/col/case?caseid=' + caseId)
  }
}

export function fetchCaseList(colId) {
  return {
    type: FETCH_CASE_LIST,
    payload: axios.get('/api/col/case_list/?col_id=' + colId)
  }
}

export function fetchVariableParamsList(colId) {
  return {
    type: FETCH_VARIABLE_PARAMS_LIST,
    payload: axios.get('/api/col/case_list_by_var_params?col_id=' + colId)
  }
}

export function setColData(data) {
  return {
    type: SET_COL_DATA,
    payload: data
  }
}
