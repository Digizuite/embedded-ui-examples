# Digizuite for Miro

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.3.0.

## Integrating to Miro
The integration is created as a [Miro Web-Plugin](https://developers.miro.com/docs/web-plugins-features) where the Digizuite Unified DAM Connector is embedded into miro.

Following have been added to index.html
```
<script src="https://miro.com/app/static/sdk.1.1.js"></script>
```

Ensuring also to init miro on onInit of the app.comonent
```
miro.onReady(() => {
      const icon24 =
        '<g> ..... </g>';
      miro.initialize({
        extensionPoints: {
          bottomBar: {
            title: 'Digizuite for Miroz',
            svgIcon: icon24,
            onClick: () => {
              miro.board.ui.openLibrary('', { title: 'Digizuite for Miro' });
            },
          },
          getWidgetMenuItems: () =>
            Promise.resolve({
              tooltip: 'Digizuite for Miroz',
              svgIcon: icon24,
              onClick: (widgets: any) => {
                console.log('onClick', widgets);
              },
            }),
        },
      });
```

On click of an asset then create the image with the following
```
await miro.board.widgets.create({ type: 'image', title: asset.title, url: asset.downloadUrl });
```


Please read the Unified DAM Conenctor documentation for more information [here])https://digizuite.atlassian.net/wiki/spaces/DD/pages/3092348945/MM5.5+Unified+DAM+Connector).


## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
