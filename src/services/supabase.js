import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default class SupabaseService {
  static async fetchUserData(userId) {
    const { data, error } = await supabase
      .from('times')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching data from Supabase:', error);
      return null;
    }

    // Transform flat list into session object
    const sessions = {
      '2x2': [],
      '3x3': [],
      '4x4': [],
      'Pyraminx': [],
      'Megaminx': [],
      'Square-1': [],
      'Blind': []
    };

    data.forEach(item => {
      if (sessions[item.session_type]) {
        sessions[item.session_type].push({
          id: item.id, // Store ID for updates/deletes
          time: item.time_ms,
          scramble: item.scramble,
          date: new Date(item.date),
          penalty: item.penalty
        });
      }
    });

    return sessions;
  }

  static async saveTime(userId, sessionType, timeData) {
    const { data, error } = await supabase
      .from('times')
      .insert([
        {
          user_id: userId,
          session_type: sessionType,
          time_ms: timeData.time,
          scramble: timeData.scramble,
          date: timeData.date.toISOString(),
          penalty: timeData.penalty
        }
      ])
      .select();

    if (error) {
      console.error('Error saving time to Supabase:', error);
      return null;
    }
    return data[0];
  }

  static async deleteTime(timeId) {
    const { error } = await supabase
      .from('times')
      .delete()
      .eq('id', timeId);

    if (error) {
      console.error('Error deleting time from Supabase:', error);
      return false;
    }
    return true;
  }

  static async updateTime(timeId, updates) {
    const { error } = await supabase
      .from('times')
      .update(updates)
      .eq('id', timeId);

    if (error) {
      console.error('Error updating time in Supabase:', error);
      return false;
    }
    return true;
  }
}
