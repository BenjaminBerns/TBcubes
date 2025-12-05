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
          time: item.time_ms / 1000,
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

  static async upsertProfile(user) {
    if (!user) return false;

    // Map WCA user object to our profile structure
    const profile = {
      id: user.id,
      wca_id: user.wca_id,
      name: user.name,
      avatar_url: user.avatar ? user.avatar.thumb_url : null, // Assuming WCA structure
      country_iso2: user.country_iso2,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' });

    if (error) {
      console.error('Error upserting profile:', error);
      return false;
    }
    return true;
  }

  static async getDailyLeaderboard(sessionType) {
    // Get start of today (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    // We need to fetch times from today and join with profiles
    // Note: Supabase JS join syntax depends on foreign keys. 
    // Assuming 'times.user_id' references 'profiles.id'.
    // If FK is not set up, we might need manual join or setup FK.
    // Let's assume for now we fetch times and then profiles, or use the relational syntax if FK exists.

    // Efficient way: Fetch top times for today, order by time_ms asc, distinct user_id?
    // "Best time of the day per user".
    // This is complex in a single simple query without a view.
    // Simplified approach: Fetch ALL times for today for this sessionType, then process in JS (if dataset is small).
    // Or fetch top 50 times of today.

    const { data: times, error } = await supabase
      .from('times')
      .select(`
        time_ms,
        user_id,
        date,
        scramble
      `)
      .eq('session_type', sessionType)
      .gte('date', todayISO)
      .order('time_ms', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }

    if (!times || times.length === 0) return [];

    // Group by user, keep best time
    const bestTimesByUser = {};
    times.forEach(t => {
      if (!bestTimesByUser[t.user_id] || t.time_ms < bestTimesByUser[t.user_id].time_ms) {
        bestTimesByUser[t.user_id] = t;
      }
    });

    const leaderboard = Object.values(bestTimesByUser).sort((a, b) => a.time_ms - b.time_ms);

    // Now fetch profiles for these users
    const userIds = leaderboard.map(t => t.user_id);
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, avatar_url, country_iso2')
      .in('id', userIds);

    if (profileError) {
      console.error('Error fetching profiles for leaderboard:', profileError);
      return leaderboard; // Return without profile info if fail
    }

    // Merge profile info
    const profileMap = {};
    profiles.forEach(p => profileMap[p.id] = p);

    return leaderboard.map((t, index) => ({
      rank: index + 1,
      time: t.time_ms / 1000,
      ...profileMap[t.user_id]
    }));
  }
}
