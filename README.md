# React + TypeScript + Vite

-GET STARTED
   run `npm install` in /react_shop_vendors
      run `npm start`
   run `npm install` in /server
      run `npm start` or `npm run dev`

# Базовая документация

### src/containers (Container).

Это компоненты, которые получают данные и колбэки из стора, содержит логику обработчиков и возвращает представление.
Как правильно один контейнер представляет собой определенный маршрут на сайте (например для роута /admin/providers 
необходимо создать контейнер в папке /src/containers/admin/providers)

Структура для каждого контейнера (на примере src/containers/admin/providers):

  src/containers/admin/providers/components - здесь все компоненты, которые используются внутри текущего контейнера. Желательно чтобы каждый компонент был чистый и не содержал никакой логики кроме отображения разметки. В этой папке всегда есть главный компонент с приставкой
  View (в данном случае ProvidersPageView). Этот компонент принимает всю необходимую информацию в качестве пропсов и возвращает только разметку или другие компоненты из папки components.

  src/containers/admin/providers/providers.ts - основной файл контейнера который возвращает компонент View ( в данном случае ProvidersPageView ). Здесь можно определять любую логику по работе с данными (например подписаться на стор, изменить значение стора, создать локальное состояние, вызвать сторонние хуки, создать различные обработчики и т.п.). Как правильно вся эта информация передается пропсами в главный компонент View.

  src/containers/admin/providers/helper.ts - файл в котором можно определять вспомогательные функции, характерные только для текущего контейнера.

  src/containers/admin/providers/constants.ts - файл в котором создаются константы которые нужны только в текущем контейнере.

### src/api (Api).
  
  Здесь создаются файлы содержащие запросы на сервер для каждой сущности. Например:
    src/api/users.ts
    src/api/providers.ts
  В каждом из этих файлов желательно называть функции в следующем формате:
    getUserDataByIdRequest или createNewUserRequest или updateUserDataRequest

### src/interfaces (Interfaces).

  Здесь определяются типы, которые характеризуют конкретную сущность. Например
    src/intefaces/user.ts - все типы связанные с пользователями
    src/intefaces/providers.ts - все типы связанные с поставщиками

### src/helpers (Helpers).

  Здесь создаются вспомогательные функции которые могут быть использованы в любом контейнере
    src/helpers/validators.helper.ts - объект с функциями для валидирования различных структур данных
    src/helpers/formatters.helper.ts - объект с функциями для форматирования структуры данных в нужный вид

### src/components (Components).

  Здесь создаются глобальные компоненты которые могут быть переиспользованы в различных контейнерах 
  (например компонент формы, компонент уведомлений и т.п.). Структура глобальных компонентов такая же как с структура
  контейнеров в src/containers

### src/components-ui (Components UI).

  Здесь создаются обертки над компонентами из UI бибилотеки в том случае, если это необходимо.

### src/controllers (Controllers).

  Здесь создаются контроллеры (в нашем случае хуки), которые работают с данными из сторов или создают свое локальное состояние.
  Эти контроллеры и данные из этих контроллеры доступны в любом контейнере приложения.

  На каждый контроллер создается один файл (например use-providers-controller.ts). В этом файле создается хук с похожим названием
  - useProvidersController в котором можно создавать локальные состояния, или подписывать на глобальные состояния из mobx и менять 
  их с помощью геттеров и сеттеров, отправлять запросы на сервер.
  Здесь также можно создавать обработчики (функции) если перед обновлением состояния нужно выполнить
  определенную логику над данными из стора. Контейнер должен возрващать объект со всеми обработчиками и состояними которые в нем созданы
  (кроме вспомогательных, если таковые будут).
   
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
  - integrate form with RHK
  - moving categories with DnD
  - create new fields for each category
  - Add products warehouse page