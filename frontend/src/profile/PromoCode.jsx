import React, { useState } from 'react';

const PromoCode = () => {
  const [promoCodes, setPromoCodes] = useState([
    { id: 'SAVE10', discount: '10%', description: 'Save 10% on orders above ₹500' },
    { id: 'FREESHIP', discount: 'Free Shipping', description: 'No delivery charge on this order' },
  ]);
  const [newCode, setNewCode] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCode || !description) return alert('Fill both fields');

    setPromoCodes((prev) => [
      ...prev,
      { id: newCode.toUpperCase(), discount: 'Custom', description },
    ]);
    setNewCode('');
    setDescription('');
  };

  const handleDelete = (id) => {
    setPromoCodes((prev) => prev.filter((code) => code.id !== id));
  };

  return (
    <div className='max-w-3xl mx-auto p-4 sm:p-6'>
      <h2 className='text-2xl font-bold mb-6'>Promo Codes</h2>

      <form onSubmit={handleAdd} className='mb-6 bg-gray-100 p-4 rounded'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <input
            type='text'
            placeholder='Promo Code'
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className='border p-2 rounded'
          />
          <input
            type='text'
            placeholder='Description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='border p-2 rounded'
          />
        </div>
        <button
          type='submit'
          className='mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
        >
          + Add Promo Code
        </button>
      </form>

      <div className='bg-white shadow rounded overflow-hidden'>
        <table className='min-w-full text-left text-sm'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='px-4 py-2'>Code</th>
              <th className='px-4 py-2'>Discount</th>
              <th className='px-4 py-2'>Description</th>
              <th className='px-4 py-2'>Action</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes.map((code) => (
              <tr key={code.id} className='border-b'>
                <td className='px-4 py-2 font-semibold'>{code.id}</td>
                <td className='px-4 py-2'>{code.discount}</td>
                <td className='px-4 py-2'>{code.description}</td>
                <td className='px-4 py-2'>
                  <button
                    onClick={() => handleDelete(code.id)}
                    className='text-red-500 hover:underline'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {promoCodes.length === 0 && (
              <tr>
                <td colSpan='4' className='text-center px-4 py-4 text-gray-500'>
                  No promo codes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoCode;
