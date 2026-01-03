'use client';
import React, {useRef,useState }  from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Image from "next/image";
import { evaluate } from "mathjs";
import axios from 'axios';
import { Expense } from "../page";


type AddProps = {
    userId: string;
    onAddExpense: (expense: Expense) => void;
};

const Add: React.FC<AddProps> = ({ userId, onAddExpense }) => {

    const [showContent, setShowContent] = useState(false);
    const [showCalculator,setShowCalculator] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [error, setError] = useState(false);
    
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [category, setCategory] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState<Date | null>(new Date());
    const [time, setTime] = useState<Date | null>(new Date());

    const nameRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null);
    const amountRef = useRef<HTMLInputElement>(null);

    const toggleContent = () => {
        setShowContent(prev => !prev); 
    };

    const toggleCalculator = () => {
        setShowCalculator(prev => !prev);
    };

    const [input, setInput] = useState('');

    const Calculator = () => {
      const handleClick = (value: string) => {
        // console.log("clicked");
        if (value === '=') {
          try {
            setAmount(evaluate(input).toString());
            setInput(evaluate(input).toString());
          } catch {
            setInput('Error');
          }
        } else if (value === 'C') {
          setInput('');
          setAmount('');
        } else if (value === '⌫') {
            setInput(prev => prev.slice(0, -1));
        } else {
          setInput(prev => prev + value);
        }
      };
    
      const buttons = ['7','8','9','C','4','5','6','⌫','1','2','3','-','0','/','*','+','.','='];
    
      return (
        <div className="p-4 rounded-md bg-gray-100 w-64">
          <div className="mb-2 p-2 bg-white rounded">{input || '0'}</div>
          <div className="grid grid-cols-4 gap-2">
            {buttons.map(btn => (
              <button
                key={btn}
                type="button"
                onClick={() => handleClick(btn)}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded text-lg"
              >
                {btn}
              </button>
            ))}
            <button 
                type="button" 
                onClick={toggleCalculator} 
                className="col-span-2 bg-gray-300 hover:bg-gray-400 rounded"
            >Close</button>
          </div>
        </div>
      );
    };
    
    const handleKeyOrBlur = (
        e: React.KeyboardEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>,
        setter: (val: string) => void,
        nextRef?: React.RefObject<HTMLInputElement | null>
        ) => {
            const inputValue = (e.target as HTMLInputElement).value;
            if (
                (e.type === 'keydown' && ((e as React.KeyboardEvent).key === 'Enter' || (e as React.KeyboardEvent).key === 'Tab')) ||
                e.type === 'blur'
            ) {
                setter(inputValue);
                if (e.type === 'keydown' && (e as React.KeyboardEvent).key === 'Enter' && nextRef?.current) {
                e.preventDefault();
                setTimeout(() => {nextRef.current?.focus();}, 50);
                }
            }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
        userId,
        type,
        name,
        category,
        amount: parseFloat(amount),
        date: date ? format(date, 'dd MMM yyyy') : '', 
        time: time ? format(time,'h:mm aa'): '',
        };

        // console.log('Form Object:', formData);
        const response = await axios.post('../api/expense', formData);
        
        if(response.data.success){
            
            // console.log("entered:", response.data.expense);
            onAddExpense(response.data.expense);
            setType("");
            setName("");
            setCategory("");
            setAmount("");
            setDate(new Date());
            setTime(new Date());
            setInput("");

            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
            }, 2000);

            toggleContent();
        }
        else
        {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000);
        }

    };
    const clearList = (e: React.SyntheticEvent) => {
        e.preventDefault();

        setType("");
        setName("");
        setCategory("");
        setAmount("");
        setDate(new Date());
        setTime(new Date());

        toggleContent();

    };

    const List = () => {
        return (
        <div className="bg-gray-700 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 max-w-[560px] rounded-xl z-50 ">
            <h1 className="text-white text-2xl rounded-xl px-5 pt-4">Add</h1>
            <div className="w-full flex flex-col justify-center items-center">
                <button onClick={toggleContent} className="h-8 w-8 absolute top-4 right-14 bg-gray-600 rounded-full hover:bg-gray-500 focus: outline-none transition-transform duration-200 ease-out active:scale-95">
                    <Image
                    className="p-2"
                    src="/arrowDown.svg"
                    alt="Minimize"
                    width={32} 
                    height={32}
                    style={{ objectFit: 'contain' }}
                    />
                </button>
                <button onClick={clearList} className="h-8 w-8 absolute top-4 right-4 bg-gray-600 rounded-full hover:bg-red-800 focus: outline-none transition-transform duration-200 ease-out active:scale-95">
                    <Image
                    className="p-2"
                    src="/close.svg"
                    alt="Close"
                    width={32} 
                    height={32}
                    style={{ objectFit: 'contain' }}
                    />
                </button>
                <form 
                    onSubmit={handleSubmit} 
                    className="w-full flex flex-col items-center gap-5 p-4 pt-7">
                    <p className="w-full">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                            className="border-2 border-gray-50 bg-gray-50 text-sm text-gray-500 p-2 pl-1 rounded-md w-full placeholder-gray-500 focus:border-gray-400 focus:outline-none ">
                                <option value="" disabled>Select Type</option>
                                <option value="Income">Income</option>
                                <option value="Expense">Expense</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                    </p>
                    <p className="w-full">
                        <input 
                            ref={nameRef}
                            type="text" 
                            placeholder="Name" 
                            name="Name"  
                            defaultValue={name}
                            onKeyDown={(e) => handleKeyOrBlur(e, setName,categoryRef)}
                            onBlur={(e) => handleKeyOrBlur(e, setName,categoryRef)}
                            required 
                            className="border-2 border-gray-50 bg-gray-50 text-sm text-gray-500 p-2 rounded-md w-full placeholder-gray-500 focus:border-gray-500 focus:outline-none"/>
                    </p>
                    <p className="w-full">
                        <input 
                            ref={categoryRef}
                            type="text" 
                            placeholder="Category" 
                            name="Category" 
                            defaultValue={category}
                            onKeyDown={(e) => handleKeyOrBlur(e, setCategory,amountRef)}
                            onBlur={(e) => handleKeyOrBlur(e, setCategory)}
                            required 
                            className="border-2 border-gray-50 bg-gray-50 text-sm text-gray-500 p-2 rounded-md w-full placeholder-gray-500  focus:border-gray-500  focus:outline-none"/>
                    </p>
                    <div className="w-full flex flex-row gap-1 ">
                        <input 
                            ref={amountRef}
                            type="number"  
                            placeholder="Amount" 
                            name="Amount" 
                            defaultValue={amount}
                            onKeyDown={(e) => handleKeyOrBlur(e, setAmount)}
                            onBlur={(e) => handleKeyOrBlur(e, setAmount)}
                            required 
                            min="0" step="0.01" 
                            className="border-2 border-gray-50 bg-gray-50 text-sm text-gray-500 p-2 rounded-md w-full placeholder-gray-500 focus:border-gray-500  focus:outline-none"/>
                            <div>
                                <button type="button" onClick={toggleCalculator} className="h-full w-10 rounded border border-gray-600 bg-gray-500 hover:bg-gray-600 focus: outline-none">
                                <Image
                                    className="p-2"
                                    src="/calculate.svg"
                                    alt="Calculate"
                                    width={40} 
                                    height={40}
                                    style={{ objectFit: 'contain' }}
                                    />
                                </button>
                                <div className="fixed top-4 right-4 z-50"> 
                                    {showCalculator && <Calculator />}
                                </div>
                            </div>
                    </div>
                    <div className="w-full flex flex-column gap-1">
                        <div className="w-3/4">
                            <DatePicker
                                selected={date}
                                onChange={setDate}
                                dateFormat="dd MMM yyyy"
                                placeholderText="Date"
                                required
                                className="w-full border-2 border-gray-50 bg-gray-50 text-sm text-gray-500 p-2 rounded-md  focus:border-gray-500  placeholder-gray-500 focus:outline-none"
                                wrapperClassName="w-full"
                            />
                        </div>
                        <div className="w-1/4">
                            <DatePicker
                                selected={time}
                                onChange={(newTime) => setTime(newTime)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={15}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                placeholderText="Time"
                                required
                                className="w-full border-2 border-gray-50 bg-gray-50 text-sm text-gray-500 p-2 rounded-md focus:border-gray-500 focus:outline-none placeholder-gray-500"
                                wrapperClassName="w-full"
                        />
                        </div>
                    </div>
                    <div className="w-full flex justify-end">
                        <button type="submit" className="mt-1 mb-4 px-3 py-1 text-sm w-1/6 bg-gray-600 text-white rounded-lg hover:bg-green-700 transition-transform duration-100 ease-out active:scale-95">
                        Add
                        </button>
                    </div>
                </form>
            </div>
        </div>
        );
    };
    
    return (
        <>
            <button onClick={toggleContent} className="h-16 w-16 fixed bottom-10 right-12 bg-gray-500 rounded-full hover:bg-gray-600 focus: outline-none transition-transform duration-200 ease-out active:scale-95">
            <Image
                className="p-2"
                src="/add.svg"
                alt="Add"
                width={64}
                height={64}
                style={{ objectFit: 'contain' }}
            />
            </button>
            {showContent && 
            (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center">
                    <List />
                </div>
            )}
            {showToast && 
            (
                <div className="fixed top-5 right-5 flex flex-row justify-start border border-gray-500 bg-white text-gray-500 text-sm p-3 rounded-sm shadow-lg z-50 w-64">
                    <Image
                    src="/checkCircle.svg"
                    alt=""
                    width={32} 
                    height={32}
                    style={{ objectFit: 'contain' }}
                    className="p-1 h-9 w-9"
                    />
                    <div className="flex items-center">Transaction added successfully!</div>
                </div>
            )}
            {error && 
            (
                <div className="fixed top-5 right-5 flex flex-row justify-start border border-gray-500 bg-white text-gray-500 text-sm p-3 rounded-sm shadow-lg z-50 w-64">
                    <Image
                    src="/error.svg"
                    alt=""
                    width={32} 
                    height={32}
                    style={{ objectFit: 'contain' }}
                    className="p-1 h-9 w-9"
                    />
                    <div className="flex items-center">Error</div>
                </div>
            )}
        </>
    )
}

export default Add