# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Activación de reservas y caja compartida

1. Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` con la URL y la clave pública del proyecto de destino.
2. La migración `src/supabase_migration_v2.sql` requiere las tablas de `src/supabase_migration_v1.sql` (clientes, reservas y pagos diarios). El archivo `src/supabase_schema.sql` corresponde a otro modelo. En un proyecto nuevo, omite el bloque de clientes de prueba de v1. En uno existente, comprueba primero el esquema, los permisos personalizados y una copia de los datos.
3. Aplica v2 una vez, como propietario de la base, y publica el frontend en la misma ventana de cambio. La transacción detiene la instalación si encuentra teléfonos normalizados duplicados, turnos activos coincidentes o entradas activas para el mismo asiento. Revisa esos registros antes de reintentar. Las reservas históricas conservan sus datos. Recepción debe verificar a su titular antes de asignarles un `owner_id`. Reconcilia también las reservas que el sistema anterior guardó con horarios aproximados.
4. En Supabase Auth, habilita el proveedor de teléfono con verificación por SMS y configura la entrega con tu proveedor. Para el personal, crea una cuenta individual de correo y contraseña por empleado. Un administrador del proyecto concede acceso registrando el UUID de esa cuenta desde el editor SQL:

   ```sql
   insert into public.studio_staff (user_id) values ('<UUID de Auth del empleado>');
   ```

5. Crea las sesiones reales desde Calendario. Antes de retirar la versión anterior, concilia los movimientos y cierres almacenados en los equipos de recepción. No se importan automáticamente porque pueden estar duplicados entre dispositivos. Si alguna de las antiguas claves compartidas se reutilizó en otro servicio, cámbiala allí.
6. Comprueba el recorrido con dos cuentas de prueba. Reserva la última bicicleta desde ambas, revisa el ticket ganador y el saldo, cobra desde recepción y consulta el cierre desde otro equipo.
