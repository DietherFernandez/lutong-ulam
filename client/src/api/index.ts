// Barrel export — all data-access functions in one place.
// The old axios-based client.ts is replaced by individual files that call Supabase directly.
export { authApi }         from './auth';
export { dishesApi }       from './dishes';
export { categoriesApi }    from './categories';
export { imagesApi }       from './images';
export { settingsApi }      from './settings';
export { openingHoursApi }  from './openingHours';
export { homepageApi }     from './homepage';
export { messagesApi }     from './messages';

// Dashboard aggregates.
import { dishesApi }  from './dishes';
import { categoriesApi } from './categories';
import { imagesApi }  from './images';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const dashboardApi = {
  async getStats() {
    const [dishes, categories, images] = await Promise.all([
      dishesApi.getStats(),
      supabase.from('categories').select('*', { count: 'exact', head: true }).then(({ count }) => ({ total: count ?? 0 })),
      imagesApi.getStats(),
    ]);
    return { dishes, categories, images };
  },
};

// Convenience: check if Supabase is configured (useful for showing a setup banner in the UI).
export { isSupabaseConfigured } from '../lib/supabase';
