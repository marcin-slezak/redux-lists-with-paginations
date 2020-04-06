import { createSlice } from '@reduxjs/toolkit';

const addList = (state, action) => ({...state, lists: [...state.lists, action.payload]});
const setRequestStatus = (state, action) => ({...state, lists})



const listWithPagination = createSlice({
  name: 'lists-with-pagination',
  initialState: {
    lists: [],
  },
  reducers: {
    addList,
    setRequestStatus
  },
});

listWithPagination.actions.getData = (listName) => async dispatch => {
  dispatch(listWithPagination.actions.setRequestStatus(listName, 'in_progress'));
  try{
    const response = await fetch('', {});
    dispatch(listWithPagination.actions.setRequestStatus(listName, 'success'));
    const data = await response.json();
    return data;
  }catch(e){
    dispatch(listWithPagination.actions.setRequestStatus(listName, 'failed'));
  }
};

export { listWithPagination };
