import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uhazowudxdpyqukojllr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoYXpvd3VkeGRweXF1a29qbGxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDY0NDYsImV4cCI6MjA0OTkyMjQ0Nn0.3lRi0VHpq8FMW4ihRQo0TYfxN-tY5z3b3WH92Ct0IYA'

export const supabase = createClient(supabaseUrl, supabaseKey)
