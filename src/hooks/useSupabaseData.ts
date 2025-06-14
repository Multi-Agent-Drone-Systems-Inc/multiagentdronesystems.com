import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface UseSupabaseDataOptions {
  table: string;
  select?: string;
  filters?: Record<string, any>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
  range?: { from: number; to: number };
}

interface UseSupabaseDataResult<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  count?: number;
}

export function useSupabaseData<T = any>({
  table,
  select = '*',
  filters = {},
  orderBy,
  limit,
  range
}: UseSupabaseDataOptions): UseSupabaseDataResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState<number | undefined>(undefined);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching data from ${table}...`);

      let query = supabase.from(table).select(select, { count: 'exact' });

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });

      // Apply ordering
      if (orderBy) {
        const column = orderBy.column === 'order' ? '"order"' : orderBy.column;
        query = query.order(column, { ascending: orderBy.ascending ?? true });
      }

      // Apply limit
      if (limit) {
        query = query.limit(limit);
      }

      // Apply range
      if (range) {
        query = query.range(range.from, range.to);
      }

      const { data: result, error: queryError, count: totalCount } = await query;

      if (queryError) {
        console.error(`Supabase error for ${table}:`, queryError);
        throw queryError;
      }

      console.log(`${table} data fetched successfully:`, result);
      setData(result || []);
      setCount(totalCount || 0);
    } catch (err) {
      console.error(`Error fetching ${table}:`, err);
      setError(`Failed to load ${table}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [table, JSON.stringify(filters), JSON.stringify(orderBy), limit, JSON.stringify(range)]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    count
  };
}

// Specific hooks for each table
export function useFAQ() {
  return useSupabaseData({
    table: 'faq',
    filters: { is_active: true },
    orderBy: { column: 'order', ascending: true }
  });
}

export function useDrones() {
  return useSupabaseData({
    table: 'droneslist',
    filters: { show: true }
  });
}

export function usePositions() {
  return useSupabaseData({
    table: 'positions',
    filters: { open: true },
    orderBy: { column: 'title', ascending: true }
  });
}

export function useReviews(page: number = 1, pageSize: number = 5) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  return useSupabaseData({
    table: 'reviews',
    orderBy: { column: 'submitted_at', ascending: false },
    range: { from, to }
  });
}

export function useDroneById(id: string) {
  return useSupabaseData({
    table: 'droneslist',
    filters: { id }
  });
}

export function useSimilarDrones(excludeId: string, limit: number = 3) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSimilarDrones = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log('Fetching similar drones...');
        const { data: result, error: queryError } = await supabase
          .from('droneslist')
          .select('*')
          .neq('id', excludeId)
          .limit(limit);

        if (queryError) {
          console.error('Supabase error:', queryError);
          throw queryError;
        }

        console.log('Similar drones fetched successfully:', result);
        setData(result || []);
      } catch (err) {
        console.error('Error fetching similar drones:', err);
        setError(`Failed to load similar drones: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    if (excludeId) {
      fetchSimilarDrones();
    }
  }, [excludeId, limit]);

  return { data, isLoading, error };
}