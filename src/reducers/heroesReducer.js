import { createAsyncThunk, createEntityAdapter, createSlice, createSelector  } from "@reduxjs/toolkit";
import { useHttp } from './../hooks/http.hook';


const heroesAdpater = createEntityAdapter()

const initialState = heroesAdpater.getInitialState({
    heoresLoadingStatus: 'idle'
});

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes',
    async () => {
        const {request} = useHttp();
        return await request("http://localhost:3001/heroes")
    }
);

const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroCreated: (state, action) => {
            heroesAdpater.addOne(state, action.payload)
        },
        heroDeleted: (state, action) => {
            heroesAdpater.removeOne(state, action.payload)
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchHeroes.pending, state => {state.heoresLoadingStatus = 'loading'})
        .addCase(fetchHeroes.fulfilled, (state, action) => {
            state.heoresLoadingStatus = 'idle';
            heroesAdpater.setAll(state, action.payload)
        })
        .addCase(fetchHeroes.rejected, state => {
            state.heoresLoadingStatus = 'error'
        })
        .addDefaultCase(() => {})
    }
});

const {actions, reducer} = heroesSlice;
const {selectAll} = heroesAdpater.getSelectors(state => state.heroes)

export default reducer

export const filteredHeroesSelector = createSelector(
    (state) => state.filters.activeFilter,
    selectAll,
    (filter, heroes) => {
        if (filter === 'all') {
            return heroes;
        } else {
            return heroes.filter(item => item.element === filter)
        }
    }
);


export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted
} = actions;