"use client"

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDB() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .limit(1);

      if (error) {
        setResult(`Error: ${error.message}\nCode: ${error.code}\nDetails: ${JSON.stringify(error.details)}`);
      } else {
        setResult(`Success! Data: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      setResult(`Exception: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const testInsert = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_name: 'Browser Test',
          user_email: 'browser@test.com',
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        setResult(`Error: ${error.message}\nCode: ${error.code}\nDetails: ${JSON.stringify(error.details)}`);
      } else {
        setResult(`Success! Inserted: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (err) {
      setResult(`Exception: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>

      <div className="space-x-4 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Test SELECT
        </button>

        <button
          onClick={testInsert}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded"
        >
          Test INSERT
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}

      {result && (
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {result}
        </pre>
      )}
    </div>
  );
}
