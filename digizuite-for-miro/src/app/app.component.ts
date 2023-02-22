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

  async ngOnInit() {
    const miro = window['miro'];

    await miro.board.ui.on('icon:click', async () => {
      await miro.board.ui.openPanel({ url: '', height: 720, width: 400 });
    });
  }

  @HostListener('window:message', ['$event'])
  onMessageReceived(event: any) {

    // Check if origin is as we expect (from myUrl)
    if(event?.origin === 'https://my-embedded-dam-url.com' && event?.data?.messageType === "AssetMessage") {

        // Always ensure that we just take first
        var asset = event.data.asset;
        if(event.data.assets && event.data.assets.length > 0) {
            asset = event.data.assets[0];
        }

        // Create the image
        this.createMiroImage(asset);

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
        await miro.board.createImage({ title: asset.title, url: asset.downloadUrl });
      } else {
        console.log('Not supported');
      }

      // Entend to more types if needed
    }
  }
}

