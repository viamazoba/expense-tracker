import { v4 as uuidv4 } from 'uuid'
import { DraftExpense, Expense } from "../types"

export type BudgetActions = 
    { type:'add-budget', payload: { budget: number } } |
    { type: 'show-modal' } |
    { type: 'close-modal' } |
    { type: 'add-expense' , payload: { expense: DraftExpense }} |
    { type: 'remove-expense', payload: {id: Expense['id']}} |
    { type: 'get-expense-by-id', payload: {id: Expense['id']}}

export type BudgetState = {
    budget: number
    modal: boolean
    expenses: Expense[]
    editingId: Expense['id']
}

export const initialState: BudgetState = {
    budget: 0,
    modal: false,
    expenses: [],
    editingId: ''
}

const createExpense = (draftExpense: DraftExpense): Expense => {
    return {
        ...draftExpense,
        id: uuidv4()
    }
}

export const budgetReducer = (
    state: BudgetState = initialState,
    action: BudgetActions
)=> {

    if(action.type === 'add-budget') {
        return {
            ...state,
            budget: action.payload.budget
        }
    }

    if(action.type === 'show-modal') {
        return {
            ...state,
            modal: true
        }
    }

    if(action.type === 'close-modal') {
        return {
            ...state,
            modal: false,
            editingId: ''
        }
    }
    
    if(action.type === 'add-expense') {
        const expense = createExpense(action.payload.expense)
        if(!state.editingId) {
            return {
                ...state,
                expenses: [...state.expenses, expense ],
                modal: false
            }
        } else {
            const newExpense = state.expenses.map(expense => {
                if(expense.id === state.editingId) {
                    return {
                        ...action.payload.expense,
                        id: state.editingId
                    }
                }

                return expense
            })

            return {
                ...state,
                expenses: [...newExpense],
                editingId: '',
                modal: false
            }
        }
    } 

    if(action.type === 'remove-expense') {
        const newExpenses = state.expenses.filter( expense => expense.id != action.payload.id )
        return {
            ...state,
            expenses: [...newExpenses ]
        }
    }
    
    if(action.type === 'get-expense-by-id') {
        return {
            ...state,
            editingId: action.payload.id,
            modal: true
        }
    } 

 return state
}