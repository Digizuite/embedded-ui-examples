import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

declare global {
  interface Window { miro: any; }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'digizuite-for-miro';
  myUrl;

  constructor(
    private sanitizer: DomSanitizer,
  ) {
    this.myUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://my-embedded-dam-url.com');
  }

  ngOnInit(): void {
    const miro = window['miro'];
    miro.onReady(() => {
      const icon24 =
        '<g> <path style="fill:#9bc9cc;stroke:none" d="M11 7h8c-2.966-3.43-5.034-3.43-8 0z"/> <path style="fill:#1f79ab;stroke:none" d="M14.129 5.346c-4.538 1.413-3.195 10.846 1.742 9.308 4.538-1.412 3.195-10.846-1.742-9.308z"/> <path style="fill:#9bc9cc;stroke:none" d="m13 7-1 2 1-2z"/> <path style="fill:#fdfdfb;stroke:none" d="M14.313 8.341c-2.14.887-.765 4.204 1.374 3.318 2.14-.887.765-4.204-1.374-3.318z"/> <path style="fill:#9bc9cc;stroke:none" d="m16 7 1 1-1-1m-6 1v4h1l-1-4m7 0 1 1-1-1m2 0v4h1l-1-4m-7 3 1 1-1-1m5 0 1 1-1-1m-4 1 1 1-1-1m3 0 1 1-1-1m-5 1 1 1-1-1m7 0 1 1-1-1m-6 1 1 1-1-1m5 0 1 1-1-1m-4 1 2 5h1l2-3v-1l-5-1z"/> <path style="fill:#efb020;stroke:none" d="M3 24c18.308 5.347 4.934-18.835 0 0z"/> <path style="fill:#fdfdfb;stroke:none" d="m13 16 1 1-1-1m3 0 1 1-1-1z"/> <path style="fill:#349f39;stroke:none" d="M27 24c-4.67-17.824-18.042 4.232 0 0z"/> <path style="fill:#fdfdfb;stroke:none" d="m14 17 1 1-1-1z"/> <path style="fill:#9bc9cc;stroke:none" d="m24 17 1 1-1-1z"/> <path style="fill:#fdfdfb;stroke:none" d="M7.643 19.067c-2.19 1.623.76 4.313 2.714 2.866 2.19-1.623-.76-4.313-2.714-2.866z"/> <path style="fill:#9bc9cc;stroke:none" d="m19 18-1 2 1-2z"/> <path style="fill:#fdfdfb;stroke:none" d="M20.367 19.157c-2.356 1.312-.02 4.354 2.016 2.776 1.802-1.397-.123-3.83-2.016-2.776z"/> <path style="fill:#9bc9cc;stroke:none" d="m16 21 1 1-1-1m2 0 1 1-1-1m8 0 1 1-1-1m-3 1 1 1-1-1m-6 1 1 1-1-1m3 0v1h3l-3-1m-2 1 1 1-1-1m7 0 1 1-1-1m-3.333 1.333.666.334-.666-.334z"/> </g>';
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
    });
  }

  @HostListener('window:message', ['$event'])
  onMessageReceived(event: any) {

    console.log(event);

    if (event?.data?.messageType) {
      const message: any = event.data;

      if(message.messageType === 'AssetMessage') {
        const asset = message.asset;

        this.createMiroImage(asset);
      }
    }
  }

  private async createMiroImage(asset: any) {
    const miro = window['miro'];

    if (miro) {
      if (
        asset.extension.toLowerCase() === 'jpg' ||
        asset.extension.toLowerCase() === 'jpeg' ||
        asset.extension.toLowerCase() === 'png' ||
        asset.extension.toLowerCase() === 'psd' ||
        asset.extension.toLowerCase() === 'indd'
      ) {
        await miro.board.widgets.create({ type: 'image', title: asset.title, url: asset.downloadUrl });
      } else {
        console.log('Not supported');
      }
    }
  }
}

