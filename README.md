# React + TypeScript + Vite

-GET STARTED
   run `npm install` in /react_shop_vendors
      run `npm start`
   run `npm install` in /server
      run `npm start` or `npm run dev`

# Базовая документация

### src/components

  ### src/components/components-ui
    Здесь хранятся обертки над UI-компонентами из библиотеки или кастомные компоненты.

  ### src/components/pages
    Здесь хранятся все страницы нашего приложения.
    Пример структуры (на примере страницы User):
            папка user-page:
             - user-page.tsx - страница
             - user-page.scss - стили для нее
             - components - содержит компоненты которые, относящиеся к текущей странице

  ### src/components/partials
    Здесь хранятся компоненты которые могут быть переиспользованы на разных
    страницах нашего приложения.

### src/components/layouts
    Здесь хранятся шаблоны для всех страниц (авторизации \ админов и т.п)


### src/helpers

  ### src/helpers/utils
    Здесь хранятся все вспомогательные функции, которые могут использоваться во всем проекте.

  ### src/helpers/validators
    Здесь хранятся все глобальные валидаторы, которые могут использоваться во всем проекте.

### src/hooks
  Здесь хранятся хуки, не содержащие бизнес-логики и не взаимодействующие с сущностями.

### src/models
  Здесь хранятся модели для каждой из сущностей приложения.
   
  Примерная структура каждой модели (на примере сущности User):

    src/models/user.ts - файл с интерфейсами для сущности User
    src/models/use-user.ts - файл с хуком, который предоставляет доступ 
      к переиспользуемым обработчикам \ глобальными сторам или локальным состояниям связанным с конкретной сущностью.
    src/models/user-api.ts - файл с функциями для работы с api указанной сущности.

### src/stores
  Здесь хранятся глобальные сторы для каждой конкретной сущности.
  На каждый стор создается отдельный файл. Именование файла осуществляется по имени сущности.
  Например, для сущности Users будет создан стор с именем Users.store.ts

### src/interfaces
  Здесь хранятся файлы с переиспользуемыми интерфейсами, не относящимеся к кокнретной сущности.

# Структура глобальных стилей

  ### src/stylesheets/themes 
    Здесь хранятся scss файлы с переменными для темизации интерфейса.
    На каждую тему создается отдельный scss файл, например:
      dark.scss
      white.scss

  ### src/stylesheets/main.scss  
    Здесь прописываются глобальные стили, характерные для каждой страницы приложения.
  
  ### src/stylesheets/application.scss
    Контейнер для всех глобальных файлов со стилями, который используется в App.tsx

# Структура стилей
  Рядом с каждым компонентом создается файл со стилями в соответствии со следующей структурой
    component-name
      component-name.tsx
      component-name.scss

  ### Использование important
    Не используем в своих стилях important, если нужно повысить приоритет селектора, то
    указываем его название несколько раз.

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
  - Install `use-react-router-breadcrumbs: ^4.0.1` and add breadcrumbs to all pages
  - Add favorites page
- Create page for managing categories
  - Install `@mui/x-tree-view`
- Add validation for managing goods form
  - Install `react-hooks-form`
- Create vendors page for admin panel
- Fix bugs for categories page and add new functionality
  - integrate form with React Hook Form
  - moving categories with Drag And Drop
  - create new fields for each category
- Add products warehouse page
- Create statistic page for admin panel