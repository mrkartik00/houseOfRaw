import React, { useState } from 'react';

const Payment = () => {
  const [cards, setCards] = useState([
    { id: '1', cardNumber: '**** **** **** 1234', cardHolder: 'John Doe', expiry: '12/25' },
  ]);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!cardNumber || !cardHolder || !expiry) return alert('Fill all card details');

    const masked = cardNumber.slice(-4).padStart(cardNumber.length, '*');
    setCards((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        cardNumber: `**** **** **** ${masked.slice(-4)}`,
        cardHolder,
        expiry,
      },
    ]);

    setCardNumber('');
    setCardHolder('');
    setExpiry('');
  };

  const handleDelete = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
  };

  return (
    <div className='max-w-3xl mx-auto p-4 sm:p-6'>
      <h2 className='text-2xl font-bold mb-6'>Payment Methods</h2>

      <form onSubmit={handleAdd} className='mb-6 bg-gray-100 p-4 rounded'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <input
            type='text'
            placeholder='Card Number'
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className='border p-2 rounded'
          />
          <input
            type='text'
            placeholder='Cardholder Name'
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value)}
            className='border p-2 rounded'
          />
          <input
            type='text'
            placeholder='Expiry (MM/YY)'
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className='border p-2 rounded'
          />
        </div>
        <button
          type='submit'
          className='mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700'
        >
          + Add Card
        </button>
      </form>

      <div className='bg-white shadow rounded overflow-hidden'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2'>Card Number</th>
              <th className='px-4 py-2'>Cardholder</th>
              <th className='px-4 py-2'>Expiry</th>
              <th className='px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className='border-b'>
                <td className='px-4 py-2 font-medium'>{card.cardNumber}</td>
                <td className='px-4 py-2'>{card.cardHolder}</td>
                <td className='px-4 py-2'>{card.expiry}</td>
                <td className='px-4 py-2'>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className='text-red-500 hover:underline'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {cards.length === 0 && (
              <tr>
                <td colSpan='4' className='text-center px-4 py-4 text-gray-500'>
                  No saved payment methods.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payment;
