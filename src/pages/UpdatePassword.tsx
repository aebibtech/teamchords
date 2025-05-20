import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function UpdatePassword({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;
      
      setMessage({ text: 'Password updated successfully!', isError: false });
      onSuccess?.(); // Close modal on success
    } catch (error) {
      setMessage({ text: error.message, isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Update Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`bg-gray-500 hover:bg-gray-600 disabled:opacity-50 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white`}
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
      {message.text && (
        <div className={`mt-4 p-3 rounded-md ${
          message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message.text}
        </div>
      )}
    </div>
  );
}
