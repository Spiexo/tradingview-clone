import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Drawing } from '../types';

export const useDrawings = (symbol: string, timeframe: string) => {
  const { user } = useAuth();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDrawings = useCallback(async () => {
    if (!user) {
      setDrawings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('drawings')
        .select('*')
        .eq('user_id', user.id)
        .eq('symbol', symbol)
        .eq('timeframe', timeframe);

      if (fetchError) throw fetchError;
      setDrawings(data || []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [user, symbol, timeframe]);

  const addDrawing = async (drawing: Omit<Drawing, 'id' | 'user_id' | 'symbol' | 'timeframe'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const newDrawing = {
        ...drawing,
        user_id: user.id,
        symbol,
        timeframe,
      };

      const { data, error: insertError } = await supabase
        .from('drawings')
        .insert([newDrawing])
        .select();

      if (insertError) throw insertError;
      if (data) {
        setDrawings((prev) => [...prev, data[0]]);
      }
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      return { data: null, error: message };
    }
  };

  const clearDrawings = async () => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error: deleteError } = await supabase
        .from('drawings')
        .delete()
        .eq('user_id', user.id)
        .eq('symbol', symbol)
        .eq('timeframe', timeframe);

      if (deleteError) throw deleteError;
      setDrawings([]);
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      return { error: message };
    }
  };

  useEffect(() => {
    fetchDrawings();
  }, [fetchDrawings]);

  return {
    drawings,
    loading,
    error,
    addDrawing,
    clearDrawings,
    refreshDrawings: fetchDrawings,
  };
};
