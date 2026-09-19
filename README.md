# Jamka Agrofed — React Migration

This project converts the public Jamka Agrofed website from the supplied HTML/PHP-era project into a Vite + React single-page application.

## Included
- Home
- About Us
- Products
- Services
- Gallery
- Contact
- Original website images and CSS
- React-based internal navigation
- Mobile menu compatibility
- Existing Web3Forms contact form action retained

## Run on Windows

1. Install Node.js LTS.
2. Open this folder in VS Code.
3. Open Terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the URL shown by Vite, normally:
`http://localhost:5173`

## Production build

```bash
npm run build
```

The deployable files will be inside `dist/`.

## Important about the old PHP admin panel

The supplied ZIP contains a large PHP/MySQL admin/billing system under `hpanal/` with authentication, customers, items, bills, payments, reports, users, settings, backups, etc.

React cannot execute those PHP files. A true full-stack migration requires converting that PHP/MySQL business logic into an API/backend (for example Node.js/Express + MySQL) and then connecting these React screens to it.

This ZIP intentionally does NOT fake that conversion. The public website is migrated to React while the existing PHP admin backend is left out of the React build.

If you want the admin panel migrated too, the next step is to build the Node/Express + MySQL API and React admin dashboard against the existing `udhar_billing.sql` schema.
