import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { categories } from "../data/categories";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import { DraftExpense, Value } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useBudget } from "../hooks/useBudget";


export default function ExpenseForm() {
    const [expense, setExpense] = useState<DraftExpense>({
        amount: 0,
        expenseName: '',
        category: '',
        date: new Date()
    })

    const [ error, setError ] = useState('')
    const [ previousAmount, setPreviousAmount ] = useState(0)
    const { dispatch, state, remainingBudget } = useBudget()

    useEffect(()=> {
        if(state.editingId){
            const editingExpense = state.expenses.filter(expense => expense.id === state.editingId)[0]
            setExpense(editingExpense)
            setPreviousAmount(editingExpense.amount)
        }
    }, [state.editingId])

    const handleChange = (e: ChangeEvent<HTMLInputElement|HTMLSelectElement>)=> {
        const newValue = e.target.id === 'amount' ? +e.target.value : e.target.value
        setExpense({
            ...expense,
            [e.target.id] : newValue
        })
    }

    const handleDateChange = (value:Value)=>{
        setExpense({
            ...expense,
            date: value
        })
    }

    const handleSubmit = (e:FormEvent<HTMLFormElement>)=> {
        e.preventDefault();

        if(Object.values(expense).includes('')) {
            setError('Todos los campos son obligatorios!')
            return
        }

        if((expense.amount - previousAmount) > remainingBudget ){
            console.log('remaining: ', remainingBudget);
            console.log(expense.amount)
            console.log(previousAmount);
            setError('No puedes sobrepasar tu presupuesto');
            return
        }

        setError('')
        dispatch({ type: 'add-expense', payload: { expense }})
        setExpense({
            amount: 0,
            expenseName: '',
            category: '',
            date: new Date()
        });
        setPreviousAmount(0);
    }

    return (
        <form className="space-y-5" onSubmit={ handleSubmit }>
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
                {state.editingId ? 'Guardar Cambios':'Nuevo Gasto'}
            </legend>
            {error && 
                <ErrorMessage>
                    {error}
                </ErrorMessage>}
            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">
                    Nombre Gasto:
                </label>
                <input 
                    type="text"
                    id="expenseName"
                    placeholder="Añade el Nombre del Gasto"
                    className="bg-slate-100 p-2"
                    name="expenseName"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">
                    Cantidad:
                </label>
                <input 
                    type="number"
                    id="amount"
                    placeholder="Añade la Cantidad del gasto: ej. 300"
                    className="bg-slate-100 p-2"
                    name="amount"
                    value={expense.amount}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">
                    Categoría:
                </label>
                <select 
                    id="category"
                    className="bg-slate-100 p-2"
                    name="category"
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value="">-- Seleccione --</option>
                    {
                        categories.map(category =>(
                            <option 
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">
                    Fecha Gasto:
                </label>
                <DatePicker
                    className="bg-slate-100 p-2 border-0"
                    value={expense.date}
                    onChange={handleDateChange}
                />
            </div>

            <input 
                type="submit" 
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingId?'Guardar Cambios':'Registrar Gasto'}
            />
        </form>
    )
}