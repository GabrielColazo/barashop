const SUPABASE_URL = 'https://mqyefceumiesjelorjbm.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xeWVmY2V1bWllc2plbG9yamJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NzA1NDYsImV4cCI6MjA5ODQ0NjU0Nn0._1pMQ9_zyoE7sD-EM8Uuu7CKpdAJX1QLlkLJQiCD2n0'

const { createClient } = supabase
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
