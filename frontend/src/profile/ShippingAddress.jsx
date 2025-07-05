import React, { useEffect, useState } from 'react';
import { getUserAddresses, addShippingAddress, updateShippingAddress, deleteShippingAddress } from '../services/addressService';
import { toast } from 'sonner';

const ShippingAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load addresses from database on mount
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await getUserAddresses();
        if (response.success) {
          setAddresses(response.addresses);
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
        toast.error('Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({ 
      firstName: '', 
      lastName: '', 
      phone: '', 
      address: '', 
      city: '', 
      state: '', 
      pincode: '', 
      country: '' 
    });
    setIsEditing(false);
    setEditingIndex(null);
  };

  const handleAddOrEdit = async (e) => {
    e.preventDefault();
    
    const { firstName, lastName, phone, address, city, state, pincode, country } = formData;
    
    if (!firstName || !lastName || !phone || !address || !city || !state || !pincode || !country) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing) {
        // Update existing address
        const response = await updateShippingAddress(editingIndex, formData);
        if (response.success) {
          // Reload addresses
          const updatedAddresses = await getUserAddresses();
          if (updatedAddresses.success) {
            setAddresses(updatedAddresses.addresses);
          }
          toast.success('Address updated successfully');
        }
      } else {
        // Add new address
        const response = await addShippingAddress(formData);
        if (response.success) {
          // Reload addresses
          const updatedAddresses = await getUserAddresses();
          if (updatedAddresses.success) {
            setAddresses(updatedAddresses.addresses);
          }
          toast.success('Address added successfully');
        }
      }
      resetForm();
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error(error.message || 'Failed to save address');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (index) => {
    const addr = addresses[index];
    if (addr) {
      // Map database fields to form fields
      setFormData({
        firstName: addr.fullName.split(' ')[0] || '',
        lastName: addr.fullName.split(' ').slice(1).join(' ') || '',
        phone: addr.mobile,
        address: addr.street,
        city: addr.city,
        state: addr.state,
        pincode: addr.pincode,
        country: addr.country,
      });
      setIsEditing(true);
      setEditingIndex(index);
    }
  };

  const handleDelete = async (index) => {
    if (window.confirm('Delete this address?')) {
      try {
        const response = await deleteShippingAddress(index);
        if (response.success) {
          // Reload addresses
          const updatedAddresses = await getUserAddresses();
          if (updatedAddresses.success) {
            setAddresses(updatedAddresses.addresses);
          }
          toast.success('Address deleted successfully');
          if (index === editingIndex) resetForm();
        }
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = (index) => {
    // For now, we'll just update locally since backend doesn't have default logic yet
    setAddresses((prev) =>
      prev.map((a, i) => ({
        ...a,
        isDefault: i === index,
      }))
    );
  };

  return (
    <div className='max-w-5xl mx-auto p-4 sm:p-6'>
      <h2 className='text-xl sm:text-2xl font-bold mb-6'>Shipping Addresses</h2>

      {/* Saved Addresses Section */}
      <div className='mb-8'>
        <h3 className='text-lg font-semibold mb-4'>Saved Addresses</h3>
        {loading ? (
          <div className='text-center py-8'>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading addresses...</p>
          </div>
        ) : (
          <div className='relative shadow-md sm:rounded-lg overflow-hidden'>
            <table className='min-w-full text-left text-gray-500'>
              <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                <tr>
                  <th className='py-2 px-4'>Name</th>
                  <th className='py-2 px-4'>Contact</th>
                  <th className='py-2 px-4'>Address</th>
                  <th className='py-2 px-4'>City</th>
                  <th className='py-2 px-4'>State</th>
                  <th className='py-2 px-4'>Pincode</th>
                  <th className='py-2 px-4 text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {addresses.length > 0 ? (
                  addresses.map((addr, index) => (
                    <tr key={index} className='border-b hover:border-gray-50'>
                      <td className='py-2 px-4 font-medium text-gray-900'>
                        {addr.fullName}
                        {addr.isDefault && (
                          <span className='ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded'>
                            Default
                          </span>
                        )}
                      </td>
                      <td className='py-2 px-4'>{addr.mobile}</td>
                      <td className='py-2 px-4'>{addr.street}</td>
                      <td className='py-2 px-4'>{addr.city}</td>
                      <td className='py-2 px-4'>{addr.state}</td>
                      <td className='py-2 px-4'>{addr.pincode}</td>
                      <td className='py-2 px-4 text-center space-x-2'>
                        {!addr.isDefault && (
                          <button
                            onClick={() => handleSetDefault(index)}
                            className='bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-sm'
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(index)}
                          className='bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-sm'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(index)}
                          className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm'
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className='py-4 px-4 text-center text-gray-500'>
                      No shipping addresses found. Add your first address below.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Address Form */}
      <div className='bg-gray-50 border border-gray-200 rounded-lg p-6'>
        <h3 className='text-lg font-semibold mb-4'>
          {isEditing ? 'Edit Address' : 'Add New Address'}
        </h3>
        
        <form onSubmit={handleAddOrEdit}>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
            <input
              type='text'
              name='firstName'
              placeholder='First Name'
              value={formData.firstName}
              onChange={handleChange}
              className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              name='lastName'
              placeholder='Last Name'
              value={formData.lastName}
              onChange={handleChange}
              className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              name='phone'
              placeholder='Phone Number'
              value={formData.phone}
              onChange={handleChange}
              className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              name='address'
              placeholder='Street Address'
              value={formData.address}
              onChange={handleChange}
              className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              name='city'
              placeholder='City'
              value={formData.city}
              onChange={handleChange}
              className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              name='state'
              placeholder='State'
              value={formData.state}
              onChange={handleChange}
              className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              name='pincode'
              placeholder='Pincode'
              value={formData.pincode}
              onChange={handleChange}
              className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <input
              type='text'
              name='country'
              placeholder='Country'
              value={formData.country}
              onChange={handleChange}
              className='border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          
          <div className='flex space-x-3'>
            <button
              type='submit'
              disabled={submitting}
              className={`px-6 py-3 rounded font-medium transition ${
                submitting 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {submitting 
                ? (isEditing ? 'Updating...' : 'Adding...') 
                : (isEditing ? 'Update Address' : 'Add Address')
              }
            </button>
            {isEditing && (
              <button
                type='button'
                onClick={resetForm}
                disabled={submitting}
                className='bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition font-medium disabled:opacity-50'
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingAddress;
