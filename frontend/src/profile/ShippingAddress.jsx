import React, { useEffect, useState } from 'react';

const LOCAL_STORAGE_KEY = 'user_shipping_addresses';

const ShippingAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    zip: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      setAddresses(JSON.parse(stored));
    }
  }, []);

  // Save to localStorage whenever addresses change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', addressLine: '', city: '', zip: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleAddOrEdit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.addressLine || !formData.city || !formData.zip) {
      alert('Please fill in all fields');
      return;
    }

    if (isEditing) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr._id === editingId ? { ...addr, ...formData, _id: editingId } : addr
        )
      );
    } else {
      const newAddress = {
        _id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0, // first one becomes default
      };
      setAddresses((prev) => [...prev, newAddress]);
    }

    resetForm();
  };

  const handleEdit = (id) => {
    const addr = addresses.find((a) => a._id === id);
    if (addr) {
      setFormData(addr);
      setIsEditing(true);
      setEditingId(id);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this address?')) {
      setAddresses((prev) => {
        const updated = prev.filter((a) => a._id !== id);
        // Ensure at least one default
        if (!updated.some(a => a.isDefault) && updated.length > 0) {
          updated[0].isDefault = true;
        }
        return updated;
      });
      if (id === editingId) resetForm();
    }
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a._id === id,
      }))
    );
  };

  return (
    <div className='max-w-5xl mx-auto p-4 sm:p-6'>
      <h2 className='text-xl sm:text-2xl font-bold mb-6'>Shipping Addresses</h2>

      <form onSubmit={handleAddOrEdit} className='mb-6 bg-gray-100 p-4 rounded shadow'>
        <div className='mt-4 flex space-x-2'>
          <button
            type='submit'
            className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
          >
            {isEditing ? 'Update Address' : '+ Add Address'}
          </button>
          {isEditing && (
            <button
              type='button'
              onClick={resetForm}
              className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition'
            >
              Cancel
            </button>
          )}
        </div>
        <br />
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <input
            type='text'
            name='name'
            placeholder='Reciever Name'
            value={formData.name}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
          <input
            type='text'
            name='phone'
            placeholder='Reciever Contact No.'
            value={formData.phone}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
          <input
            type='text'
            name='addressLine'
            placeholder='Address'
            value={formData.addressLine}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
          <input
            type='text'
            name='city'
            placeholder='City'
            value={formData.city}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
          <input
            type='text'
            name='zip'
            placeholder='ZIP Code'
            value={formData.zip}
            onChange={handleChange}
            className='border p-2 rounded w-full'
          />
        </div>
        
      </form>

      <div className='relative shadow-md sm:rounded-lg overflow-hidden'>
        <table className='min-w-full text-left text-gray-500'>
          <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
            <tr>
              <th className='py-2 px-4'>Reciever Name</th>
              <th className='py-2 px-4'>Contact No.</th>
              <th className='py-2 px-4'>Address</th>
              <th className='py-2 px-4'>City</th>
              <th className='py-2 px-4'>ZIP</th>
              <th className='py-2 px-4 text-center'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {addresses.length > 0 ? (
              addresses.map((addr) => (
                <tr key={addr._id} className='border-b hover:border-gray-50'>
                  <td className='py-2 px-4 font-medium text-gray-900'>
                    {addr.name}
                    {addr.isDefault && (
                      <span className='ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                        Default
                      </span>
                    )}
                  </td>
                  <td className='py-2 px-4'>{addr.phone}</td>
                  <td className='py-2 px-4'>{addr.addressLine}</td>
                  <td className='py-2 px-4'>{addr.city}</td>
                  <td className='py-2 px-4'>{addr.zip}</td>
                  <td className='py-2 px-4 text-center space-x-2'>
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefault(addr._id)}
                        className='bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-sm'
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(addr._id)}
                      className='bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(addr._id)}
                      className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className='py-4 px-4 text-center text-gray-500'>
                  No shipping addresses found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingAddress;
