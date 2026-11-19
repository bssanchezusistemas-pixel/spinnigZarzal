import { useState } from 'react';
import type { Bike, ClassSession, Reservation } from '../../types';
import { book, message } from '../../services/studio';

export function Screen4_Confirmation({
  session,
  bike,
  phone,
  defaultName,
  hasPlan,
  onConfirmed,
  onBack,
}: {
  session: ClassSession;
  bike: Bike;
  phone: string;
  defaultName?: string;
  hasPlan?: boolean;
  onConfirmed: (r: Reservation) => void;
  onBack: () => void;
}) {
  const [name, setName] = useState(defaultName ?? '');
  const [membership, setMembership] = useState(hasPlan ?? false);
  const [request] = useState(() => crypto.randomUUID());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      onConfirmed(await book(session, bike, name.trim(), request, membership));
    } catch (cause) {
      setError(message(cause));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="studio-panel">
      <button onClick={onBack}>Volver a bicicletas</button>
      <h1>Confirma tu reserva</h1>
      <p>
        {session.title} · {session.dateFormatted} · {session.time}
      </p>
      <p>
        Bicicleta #{bike.number} · Celular verificado {phone}
      </p>
      <form onSubmit={confirm}>
        <label>
          Nombre del participante
          <input
            autoComplete="name"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Forma de ingreso
          <select
            value={membership ? 'plan' : 'individual'}
            onChange={(e) => setMembership(e.target.value === 'plan')}
          >
            <option value="individual">
              Clase individual ·{' '}
              {session.priceParticular.toLocaleString('es-CO')} COP
            </option>
            <option value="plan">Usar una clase de mi membresía</option>
          </select>
        </label>
        {error && <p role="alert">{error}</p>}
        <button disabled={busy}>
          {busy ? 'Confirmando…' : 'Confirmar reserva'}
        </button>
      </form>
    </section>
  );
}
