import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'
import type { WatchlistItem } from '../types'

export const useWatchlist = () => {
  const { user } = useAuth()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWatchlist = useCallback(async () => {
    if (!user) {
      setWatchlist([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', user.id)

      if (fetchError) throw fetchError
      setWatchlist(data || [])
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [user])

  const addToWatchlist = async (asset: Omit<WatchlistItem, 'id' | 'user_id'>) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { data, error: insertError } = await supabase
        .from('watchlist')
        .insert([{ ...asset, user_id: user.id }])
        .select()

      if (insertError) throw insertError
      if (data) {
        setWatchlist((prev) => [...prev, data[0]])
      }
      return { data, error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred'
      return { data: null, error: message }
    }
  }

  const removeFromWatchlist = async (id: string) => {
    if (!user) return { error: 'User not authenticated' }

    try {
      const { error: deleteError } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (deleteError) throw deleteError
      setWatchlist((prev) => prev.filter((item) => item.id !== id))
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred'
      return { error: message }
    }
  }

  useEffect(() => {
    fetchWatchlist()
  }, [fetchWatchlist])

  return {
    watchlist,
    loading,
    error,
    addToWatchlist,
    removeFromWatchlist,
    refreshWatchlist: fetchWatchlist,
  }
}
