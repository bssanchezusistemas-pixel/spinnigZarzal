import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
test('Studio permissions, bookings and cash register', async () => {
  const db = new PGlite();
  try {
    const file = (p) =>
      readFileSync(new URL('../src/' + p, import.meta.url), 'utf8').replace(
        /^\uFEFF/,
        '',
      );
    await db.exec(
      "create role anon;create role authenticated;create schema auth;create table auth.users(id uuid primary key,phone text, phone_confirmed_at timestamptz);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('app.uid',true),'')::uuid$$;grant usage on schema auth to anon,authenticated;",
    );
    await db.exec(
      file('supabase_migration_v1.sql').replace(
        /CREATE EXTENSION IF NOT EXISTS "uuid-ossp";/,
        '',
      ),
    );
    await db.exec(file('supabase_migration_v2.sql'));
    const ids = Array.from({ length: 6 }, () => crypto.randomUUID());
    const [a, b, staff, first, second, request] = ids;
    await db.exec(`insert into auth.users values ('${a}','573154829102',now()),('${b}','573000000002',now()),('${staff}',null,null);
insert into public.studio_staff values ('${staff}');insert into classes(id,class_date,start_time,title) values ('${first}',current_date+2,'08:45','Morning'),('${second}',current_date+2,'14:15','Afternoon');`);
    const login = async (u) => {
      await db.exec('reset role; set role authenticated;');
      await db.query("select set_config('app.uid',$1,false)", [u]);
    };
    const book = (cl, req, member) =>
      db.query("select * from studio_book($1,'02','Rider',$2,$3)", [
        cl,
        req,
        member,
      ]);
    const cash = (op, payload) =>
      db.query('select studio_cash(current_date+2,$1,$2::jsonb)', [
        op,
        JSON.stringify(payload),
      ]);
    await db.exec('set role anon');
    await assert.rejects(db.query('select * from clients'));
    await assert.rejects(
      db.query("select check_client_membership('0000000000')"),
    );
    await login(a);
    const r = (await book(first, request, true)).rows[0];
    assert.equal(r.class_time, '08:45:00');
    assert.equal((await book(first, request, true)).rows[0].id, r.id);
    assert.equal(r.payment_status, 'included_in_membership');
    await assert.rejects(cash('close', {}));
    assert.equal((await db.query('select * from reservations')).rows.length, 1);
    await login(b);
    assert.equal((await db.query('select * from reservations')).rows.length, 0);
    await assert.rejects(book(first, crypto.randomUUID(), false), /ocupada/);
    const others = (
      await db.query("select status from studio_seats($1) where number='02'", [
        second,
      ])
    ).rows;
    assert.equal(others[0].status, 'available');
    const bRow = (await book(second, crypto.randomUUID(), false)).rows[0];
    assert.equal(bRow.class_time, '14:15:00');
    await login(staff);
    await cash('collect', { id: bRow.id, method: 'nequi' });
    await cash('collect', { id: bRow.id, method: 'nequi' });
    const sale = {
      id: crypto.randomUUID(),
      name: 'Prueba',
      concept: 'otro',
      label: 'Extra',
      amount: 2000,
      method: 'efectivo',
    };
    await cash('sale', sale);
    await cash('sale', sale);
    await cash('close', { notes: 'test' });
    const totals = (await db.query('select * from cash_closures')).rows[0];
    assert.equal(Number(totals.total_income), 12000);
    assert.equal(totals.total_riders, 2);
    await assert.rejects(cash('sale', sale), /cerrada/);
    assert.equal(
      (
        await db.query(
          'select remaining_classes from memberships where client_id=$1',
          [r.client_id],
        )
      ).rows[0].remaining_classes,
      7,
    );
  } finally {
    await db.close();
  }
});
