const { createClient } = require('@supabase/supabase-js');

// Using the same credentials as in supabase-client.js
const supabaseUrl = 'https://egfibejxkmwppddzehet.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnZmliZWp4a213cHBkZHplaGV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjE1MTQsImV4cCI6MjA3Mzc5NzUxNH0.2IwoEezkPt0CJFvwqo0grGgp72ySJqCeNoUaVQSopQU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function removeEmergencyNumber() {
    try {
        console.log('Removing emergency number from settings...');
        
        // Delete the emergency_number setting
        const { error } = await supabase
            .from('site_settings')
            .delete()
            .eq('setting_key', 'emergency_number');
        
        if (error) {
            console.error('Error removing emergency number:', error);
            process.exit(1);
        }
        
        console.log('Emergency number removed successfully!');
        
        // Also update the setting to empty value as an alternative approach
        const { error: upsertError } = await supabase
            .from('site_settings')
            .upsert({
                setting_key: 'emergency_number',
                setting_value: '',
                setting_type: 'text'
            }, {
                onConflict: 'setting_key'
            });
        
        if (upsertError) {
            console.error('Error updating emergency number to empty:', upsertError);
        } else {
            console.log('Emergency number updated to empty value as backup.');
        }
        
    } catch (err) {
        console.error('Unexpected error:', err);
        process.exit(1);
    }
}

removeEmergencyNumber();