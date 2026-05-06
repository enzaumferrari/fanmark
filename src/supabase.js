import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xdonobhepzyufqxinate.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkb25vYmhlcHp5dWZxeGluYXRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NDI2NDAsImV4cCI6MjA5MzUxODY0MH0._OVkYo1PlwyNklO52KFAZ4tOqdGEdx8jgUGsYyf0iTc'

export const supabase = createClient(supabaseUrl, supabaseKey)