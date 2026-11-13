import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://crvvcnzrwbxdzgifiblc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydnZjbnpyd2J4ZHpnaWZpYmxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMDgzOTUsImV4cCI6MjA5ODY4NDM5NX0.whEMSVHP0CRek8oMjK7o70DdZUJTSSOwG0HOMmNqvPI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface MembershipCheckResult {
  found: boolean;
  has_membership: boolean;
  client_type: 'mensualidad' | 'particular';
  price_to_pay: number;
  message: string;
  client_id?: string;
  client_name?: string;
  phone?: string;
  membership_id?: string;
  plan_id?: string;
  plan_name?: string;
  remaining_classes?: number;
  total_classes?: number;
  expires_at?: string;
  benefit_favorite_bike?: boolean;
}

/**
 * Consulta en Supabase si un número de WhatsApp tiene membresía activa
 */
export async function checkClientMembershipByPhone(phone: string): Promise<MembershipCheckResult> {
  try {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 7) {
      return {
        found: false,
        has_membership: false,
        client_type: 'particular',
        price_to_pay: 10000,
        message: 'Ingresa un número válido para verificar membresía.',
      };
    }

    const { data, error } = await supabase.rpc('check_client_membership', {
      p_phone: phone,
    });

    if (error) {
      console.warn('Error calling check_client_membership, fallback:', error);
      return {
        found: false,
        has_membership: false,
        client_type: 'particular',
        price_to_pay: 10000,
        message: 'No fue posible validar la membresía en línea.',
      };
    }

    return data as MembershipCheckResult;
  } catch (err) {
    console.error('Exception in checkClientMembershipByPhone:', err);
    return {
      found: false,
      has_membership: false,
      client_type: 'particular',
      price_to_pay: 10000,
      message: 'Error de conexión con el servidor.',
    };
  }
}
