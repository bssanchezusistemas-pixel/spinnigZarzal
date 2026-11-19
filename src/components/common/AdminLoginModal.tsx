import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { message } from '../../services/studio';

export function AccountForm({
  staff,
  onBack,
  onSuccess,
}: {
  staff: boolean;
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [identity, setIdentity] = useState('');
  const [secret, setSecret] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      if (staff) {
        const { error } = await supabase.auth.signInWithPassword({
          email: identity.trim(),
          password: secret,
        });
        if (error) throw error;
        const access = await supabase
          .from('studio_staff')
          .select('user_id')
          .maybeSingle();
        if (access.error || !access.data) {
          await supabase.auth.signOut({ scope: 'local' });
          throw new Error('Esta cuenta no tiene acceso administrativo.');
        }
      } else {
        const digits = identity.replace(/\D/g, '');
        const phone = digits.length === 10 ? '+57' + digits : '+' + digits;
        if (!/^\+57\d{10}$/.test(phone))
          throw new Error('Ingresa un celular colombiano de diez dígitos.');
        const { error } = sent
          ? await supabase.auth.verifyOtp({
              phone,
              token: secret.trim(),
              type: 'sms',
            })
          : await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        if (!sent) {
          setSent(true);
          return;
        }
      }
      onSuccess();
    } catch (cause) {
      setError(message(cause));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="studio-panel">
      <button onClick={onBack}>Volver</button>
      <h1>{staff ? 'Acceso del personal' : 'Verifica tu celular'}</h1>
      <form onSubmit={submit}>
        <label>
          {staff ? 'Correo del empleado' : 'Celular'}
          <input
            autoComplete={staff ? 'username' : 'tel'}
            type={staff ? 'email' : 'tel'}
            required
            readOnly={sent}
            value={identity}
            onChange={(e) => setIdentity(e.target.value)}
          />
        </label>
        {(staff || sent) && (
          <label>
            {staff ? 'Contraseña' : 'Código recibido por SMS'}
            <input
              autoComplete={staff ? 'current-password' : 'one-time-code'}
              type={staff ? 'password' : 'text'}
              required
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          </label>
        )}
        {error && <p role="alert">{error}</p>}
        <button disabled={busy}>
          {busy
            ? 'Espera…'
            : staff
              ? 'Ingresar'
              : sent
                ? 'Verificar'
                : 'Enviar código'}
        </button>
        {sent && (
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setSecret('');
            }}
          >
            Cambiar número o solicitar otro código
          </button>
        )}
      </form>
    </section>
  );
}
