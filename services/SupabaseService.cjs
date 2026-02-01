const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CACHE_TTL = 10 * 60 * 1000; // 10 Minutes
const cache = {
    library: { data: null, timestamp: 0 },
    series: { data: null, timestamp: 0 },
    issues: new Map() // Map<seriesId, { data, timestamp }>
};

async function getLibrary() {
    try {
        if (cache.library.data && (Date.now() - cache.library.timestamp < CACHE_TTL)) {
            console.log('[Supabase] Serving Library from Cache');
            return { success: true, data: cache.library.data };
        }

        const { data, error } = await supabase
            .from('issues')
            .select(`
                *,
                series (
                    title,
                    description
                )
            `)
            .order('series_id', { ascending: true })
            .order('issue_number', { ascending: true });

        if (error) {
            console.error('Supabase Error:', error);
            throw error;
        }

        cache.library.data = data;
        cache.library.timestamp = Date.now();
        return { success: true, data };
    } catch (err) {
        console.error('GetLibrary Exception:', err);
        return { success: false, error: err.message };
    }
}

async function getSeries() {
    try {
        if (cache.series.data && (Date.now() - cache.series.timestamp < CACHE_TTL)) {
            return { success: true, data: cache.series.data };
        }

        const { data, error } = await supabase
            .from('series')
            .select('*')
            .order('title', { ascending: true });

        if (error) throw error;

        cache.series.data = data;
        cache.series.timestamp = Date.now();
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

async function getIssues(seriesId) {
    try {
        const cached = cache.issues.get(seriesId);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            return { success: true, data: cached.data };
        }

        const { data, error } = await supabase
            .from('issues')
            .select('*')
            .eq('series_id', seriesId)
            .order('issue_number', { ascending: true });

        if (error) throw error;

        cache.issues.set(seriesId, { data, timestamp: Date.now() });
        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

module.exports = { getLibrary, getSeries, getIssues };
