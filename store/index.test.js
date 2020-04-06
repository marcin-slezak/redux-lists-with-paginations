import { getStore } from '../store';
import { listWithPagination, listSelector } from './ducks';

test('start with empty list', () => {
    const store = getStore();
    expect(store.getState().listWithPagination).toEqual({ lists: [] })
})

test('declare firsy list and list selector', async () => {
    const store = getStore();
    const list = {
        name: 'files',
        page: 0,
        total: 0,
        offset:0,
        data: [],
        limit: 0,
        url: false,
        requestStatus: false
    };
    await store.dispatch(listWithPagination.actions.addList({name: 'files'}));
    expect(store.getState().listWithPagination).toEqual({
        lists: [list]
    });
})

test('empty list selector', async () => {
    const store = getStore();
    const filesListSelector = listSelector('files');
    expect(filesListSelector(store.getState().listWithPagination)).toBe(undefined);
})

test('list selector', async () => {
    const store = getStore();
    const filesListSelector = listSelector('files');
    const list = {
        name: 'files',
        page: 0,
        total: 0,
        offset:0,
        data: [],
        limit: 0,
        url: false,
        requestStatus: false
    };
    await store.dispatch(listWithPagination.actions.addList({name: 'files'}));
    expect(filesListSelector(store.getState().listWithPagination)).toEqual(list);
})

test('load data', async () => {
    
    const serverResponse = {
        total: 20,
        data: [0,1,2,3,4,5,6,7,8,9],
    };
    global.fetch = jest.fn().mockResolvedValueOnce({ json: jest.fn().mockResolvedValueOnce({ ...serverResponse }) })
    const store = getStore();
    const nextUserStates = [];
    store.subscribe(() => { nextUserStates.push(store.getState().listWithPagination.lists) });
    await store.dispatch(listWithPagination.actions.addList({name: 'files', url: 'someTestUrl'}));
    await store.dispatch(listWithPagination.actions.load('files'));
    expect(store.getState().listWithPagination).toEqual({
        lists: [{
            name: 'files',
            page: 0,
            total: 20,
            offset:0,
            data: [0,1,2,3,4,5,6,7,8,9],
            limit: 0,
            url: 'someTestUrl',
            requestStatus: listWithPagination.REQUEST_STATUS.SUCCESS
        }]
    });
    console.log(nextUserStates)
})