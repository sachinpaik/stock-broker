"use client"
import {useState, useEffect} from 'react';
import axios from 'axios';
import {useWatchlistsDataStore} from '../zustand/useWatchlistsDataStore';
//import io from "socket.io-client";
import Modal from './modal';
import {AiOutlineEllipsis} from 'react-icons/ai';
import {MdDelete, MdEdit} from "react-icons/md";
import io from "socket.io-client";

const Sidebar = () => {

    const [activeTab, setActiveTab] = useState('watchlists');
    const [activeWatchlist, setActiveWatchlist] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [newStock, setNewStock] = useState('');
    const [newStockWatchlist, setNewStockWatchlist] = useState('');
    const [socket, setSocket] = useState(null);
    const {watchlists, updateWatchlists} = useWatchlistsDataStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [watchlistTitle, setwatchlistTitle] = useState('');

    const [showOptions, setShowOptions] = useState(false);
    const [showEditOptions, setShowEditOptions] = useState(false);
    const [editWatchListName, setEditWatchListName] = useState('');

    const toggleOptions = () => setShowOptions(!showOptions);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setActiveWatchlist(null);
    };

    const handleWatchlistClick = (watchlist) => {
        if (watchlist) {
            setActiveTab('watchlist');

        }
        else {
            setActiveTab(null);
        }

        setActiveWatchlist(watchlist);
        setNewStock('');
        setShowOptions(false);
        setShowEditOptions(false);
    };

    const handleAddWatchlist = async (watchlistTitleText) => {
        try {
            setwatchlistTitle(watchlistTitleText);
            console.log('Adding watchlist ', watchlistTitleText);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/add`, {
                "title": watchlistTitleText
            })
            console.log(res);
            updateWatchlists([...watchlists, res.data]);
            handleWatchlistClick(res.data);
        } catch (error) {
            console.log('Error in adding watchlist ', error.message);
        }
    };

    const handleDeleteWatchList = async () => {
        try {
            console.log('Deleting WatchList');
            const watchListToDelete = activeWatchlist.title;
            console.log(watchListToDelete);
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/delete`, {
                data: {
                    "watchlist": watchListToDelete
                }
            })
            console.log(res);
            const updatedWatchlists = watchlists.filter(watchlist => watchlist.title !== watchListToDelete);
            updateWatchlists(updatedWatchlists);
            if (updatedWatchlists.length > 0) {
                handleWatchlistClick(updatedWatchlists[0]);
            } else {
                handleWatchlistClick(null); // Or handle appropriately if no watchlists are left
            }
        } catch (error) {
            console.log('Error in deleting watchlist ', error.message);
        }
    };

    const handleUpdateWatchList = async () => {
        try {
            console.log('Updating WatchList');
            const activeTitle = activeWatchlist.title;
            console.log(activeTitle);
            const res = await axios.patch(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/update`,
                {
                    "title": activeTitle,
                    "newTitle": editWatchListName

                })
            console.log(res);
            updateWatchlists([...watchlists.filter(watchlist => watchlist._id !== res.data._id), res.data]);
            console.log(res);
            handleWatchlistClick(res.data);
        } catch (error) {
            console.log('Error in updating watchlist ', error.message);
        }
    }

    const handleEdit = async (e) => {
        setShowEditOptions(true);
    };
    const handleAddStock = async () => {
        try {
            console.log('Adding stock');
            const res = await axios.post(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/addStock`, {
                "watchlist": activeWatchlist.title,
                "stock": newStock
            });
            watchlists.find(watchlist => watchlist._id === res.data._id).stocks.push(newStock);
            updateWatchlists([...watchlists]);
            console.log(res);
        } catch (error) {
            console.log(error);
            console.log('Error in adding stock');
        }
    };

    const handleDeleteStock = async (e) => {
        try {
            console.log('Deleting stock');
            const stockToBeRemoved = e.target.value;
            console.log(stockToBeRemoved)
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/deleteStock`, {
                data: {
                    "watchlist": activeWatchlist.title,
                    "stock": stockToBeRemoved
                }
            });
            watchlists.find(watchlist => watchlist._id === res.data._id).stocks = res.data.stocks;
            updateWatchlists([...watchlists]);
            console.log(watchlists);
        } catch (error) {
            console.log(error);
            console.log('Error in deleting stock');
        }
    };

    const getWatchlists = async () => {
        try {
            console.log('Getting Watchlists');
            const res = await axios.get(`${process.env.NEXT_PUBLIC_WL_BE_URI}/watchlists/get`);
            console.log(res);
            updateWatchlists(res.data);
            //setting first watchlist as active by default
            if (res.data.length !== 0) {
                console.log('setting first watchlist as active');
                setActiveTab('watchlist');
                setActiveWatchlist(res.data[0]);
            }
        } catch (error) {
            console.log('Error in getting watchlists');
        }
    }

    const searchStocks = async (e) => {
        setNewStock(e.target.value);

        const stockToBeSearched = e.target.value;
        if (newStock.length > 2) {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_AG_URI}`, {params: {q: stockToBeSearched}});
                console.log('Stocks received - ', res.data);
                const stockNames = res.data.map(stock => stock._source.name); // Extract stock names
                console.log('Stocks received - ', stockNames);
                setSuggestions(stockNames);
            } catch (error) {
                console.log("Error in searching : ", error.message)
            }
        } else {
            setSuggestions([]);
        }
    }


    useEffect(() => {
        getWatchlists();
        const newSocket = io(`${process.env.NEXT_PUBLIC_MD_BE_URI}`);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    return (
        <div className="flex flex-col bg-gray-200 h-screen border-r border-gray-300">
            <div className="p-2">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-lg font-semibold">Watchlists</h1>
                    <button
                        className={`text-blue-500
                                   hover:text-blue-700
                                   p-2
                                   ${isModalOpen ? 'hidden' : ''}`}
                        onClick={openModal}
                    >
                        +
                    </button>
                    {isModalOpen && (
                        <Modal onClose={closeModal}
                               onSubmit={handleAddWatchlist}/>
                    )}
                </div>
                <div className="bg-white rounded-lg shadow-md">
                    <ul className="flex bg-gray-600 border-b border-gray overflow-x-auto">
                        {watchlists.map((watchlist, index) => (
                            <li
                                key={index}
                                className={`cursor-pointer mr-4 p-2 ${activeTab === 'watchlist' &&
                                activeWatchlist === watchlist
                                    ? 'font-semibold bg-white'
                                    : ''
                                }`}
                                onClick={() =>
                                    handleWatchlistClick(watchlist)}
                            >
                                {watchlist.title}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {activeTab === 'watchlist' && (
                <div className="p-4">
                    <div className="p-4 bg-white overflow-x-auto h-full">
                        <div className="flex justify-end items-center">
                            <div className='relative inline-block'>
                                <button
                                    onClick={toggleOptions}
                                    className='inline-flex justify-center items-center p-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                    aria-expanded='true'
                                    aria-haspopup='true'
                                >
                                    <AiOutlineEllipsis className='h-5 w-5' aria-hidden='true'/>
                                </button>
                                {showOptions && (
                                    <div
                                        className='origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
                                        <div className='py-1'>
                                            <button
                                                className='text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                                                onClick={handleEdit}>
                                                <MdEdit className='inline mr-3'/>Edit
                                            </button>
                                            <button
                                                className='text-gray-700 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
                                                onClick={handleDeleteWatchList}>
                                                <MdDelete className='inline mr-3'/>Delete
                                            </button>
                                        </div>
                                        {showEditOptions && (
                                            <div className='flex items-center space-x-2'>
                                                <input type='text' value={editWatchListName}
                                                       onChange={(e) => setEditWatchListName(e.target.value)}
                                                       className='mt-2 px-4 py-2 border rounded-md shadow-sm'
                                                       placeholder='Edit text here...' autoFocus/>
                                                <button onClick={handleUpdateWatchList}
                                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>Submit
                                                </button>
                                            </div>
                                        )
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md">
                            <div className="flex items-start">
                                <h1 className="text-xl font-bold text-gray-700">{activeWatchlist.title}</h1>
                            </div>
                            <div className="flex items-center">
                                <div className="relative flex-grow items-center">
                                    <input
                                        type="text"
                                        id={activeWatchlist.title}
                                        className="block w-30 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="New Stock"
                                        value={newStock}
                                        onChange={searchStocks}
                                    />
                                    {suggestions.length > 0 && (
                                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                                            {suggestions.map((suggestion, index) => (
                                                <li
                                                    key={index}
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                                                    onClick={() => {
                                                        setNewStock(suggestion);
                                                        setSuggestions([]);
                                                    }}
                                                >
                                                    {suggestion}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button
                                    className="items-end  px-1 py-1 bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleAddStock}
                                >
                                    +
                                </button>

                            </div>
                        </div>
                        <div>
                            <ul className="space-y-2 text-gray-700">
                                {watchlists
                                    .find((watchlist) => watchlist === activeWatchlist)
                                    ?.stocks.map((stock, index) => (
                                        <li key={index}>{stock}
                                            <button
                                                className="items-end  px-1 py-1 text-red-400"
                                                value={stock}
                                                onClick={handleDeleteStock}
                                            >
                                                x
                                            </button>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Sidebar;