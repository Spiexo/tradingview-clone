import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import type { Alert } from '../types';

export const useAlerts = (symbol?: string) => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      let query = supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (symbol) {
        query = query.eq('symbol', symbol);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setAlerts(data || []);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  }, [user, symbol]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const addAlert = async (alert: Omit<Alert, 'id' | 'user_id'>) => {
    if (!user) return;

    try {
      const { data, error: insertError } = await supabase
        .from('alerts')
        .insert([
          {
            ...alert,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;
      setAlerts((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error adding alert:', err);
      throw new Error('Failed to add alert');
    }
  };

  const removeAlert = async (id: string) => {
    if (!user) return;

    try {
      const { error: deleteError } = await supabase
        .from('alerts')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Error removing alert:', err);
      throw new Error('Failed to remove alert');
    }
  };

  return {
    alerts,
    loading,
    error,
    addAlert,
    removeAlert,
    refreshAlerts: fetchAlerts,
  };
};
