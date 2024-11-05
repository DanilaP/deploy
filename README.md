# React + TypeScript + Vite

-GET STARTED
   run `npm install` in /react_shop_vendors
      run `npm start`
   run `npm install` in /server
      run `npm start` or `npm run dev`
   
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```
- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
- Install `@emotion/react, @emotion/styled, @mui/material`
- Routes are devided into admin and general
- Routes and components for auth pages `auth/signIn` and `auth/signUp` updated
- Add templates for HomePage and Admin components
- Add template for service `404` page
- Install `axios` and add base auth
- Add authorization by tokens
- Add black and white theme styles
- Add roles page `/admin/roles`
- Add permissions page `/admin/permissions`
- Install `@mui/lab`,
- Integrate permissions with roles
- In case you have issues with packages @material-ui/core and @material-ui/icons just runfollowing command before npm i npm config 
  - set legacy-peer-deps true
  - Uninstall `@material-ui/core`, `@material-ui/icons`, Install `react-icons: ^5.3.0`
- Add page for managing goods for admin
  - added lodash package into dependencies



