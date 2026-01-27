//demo file don't modify just study

// only imported components/modules should be the code here unless if there are specific reasons why there are other codes should be here

'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import SampleText from '../modules/sample-page/SampleText'
import Link from 'next/link'

export default function SampleCrudPage() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get('/api/sample')
      setItems(response.data.items || [])
      console.log('Fetched items:', response.data.items)
    } catch (err) {
      console.error('Error fetching items:', err)
      setError(err.response?.data?.error || 'Failed to fetch items')
    } finally {
      setLoading(false) 
    }
  }

  const addItem = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return

    try {
      setError(null)
      console.log('Adding item:', newItem)
      const response = await axios.post('/api/sample', {
        name: newItem.trim()
      })

      console.log('Item added:', response.data)
      setItems(response.data.items || [])
      setNewItem('')
    } catch (err) {
      console.error('Error adding item:', err)
      setError(err.response?.data?.error || 'Failed to add item')
    }
  }

  const deleteItem = async (id) => {
    try {
      setError(null)
      console.log('Deleting item:', id)
      const response = await axios.delete('/api/sample', {
        data: { id }
      })

      console.log('Item deleted:', response.data)
      setItems(response.data.items || [])
    } catch (err) {
      console.error('Error deleting item:', err)
      setError(err.response?.data?.error || 'Failed to delete item')
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-2xl mx-auto'>
        <SampleText />

        <Link href='/login' className='text-blue-600 hover:underline mb-6 inline-block'>
          LOGIN →
        </Link>
        <br></br>
        <Link href='/inventory' className='text-blue-600 hover:underline mb-6 inline-block'>
          INVENTORY ONLY→
        </Link>
        <br></br>
        <Link href='/test' className='text-blue-600 hover:underline mb-6 inline-block'>
          INVENTORY w TEST NAV →
        </Link>

        <div className='bg-white rounded-lg shadow-md p-6 mt-6'>
          <h2 className='text-2xl font-bold mb-4'>Firebase CRUD Demo</h2>

          {error && <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{error}</div>}

          <form onSubmit={addItem} className='flex gap-2 mb-6'>
            <input
              type='text'
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder='Enter item name...'
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              type='submit'
              className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Add
            </button>
          </form>

          {loading ? (
            <p className='text-gray-500'>Loading...</p>
          ) : items.length === 0 ? (
            <p className='text-gray-500'>No items yet. Add one above!</p>
          ) : (
            <ul className='space-y-2'>
              {items.map((item) => (
                <li
                  key={item.id}
                  className='flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors'
                >
                  <div>
                    <span className='text-gray-800 font-medium'>{item.name}</span>
                    {item.createdAt && (
                      <span className='text-gray-400 text-sm ml-2'>{new Date(item.createdAt).toLocaleString()}</span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className='mt-4 text-sm text-gray-500'>Total items: {items.length}</div>
        </div>
      </div>
    </div>
  )
}
