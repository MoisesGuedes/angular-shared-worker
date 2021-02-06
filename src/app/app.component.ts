import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('input') input!: ElementRef;
  @ViewChild('preview') preview!: ElementRef<HTMLCanvasElement>;
  worker!: Worker;
  previewCtx:any
  appLifespan = timer(0, 1000);

  ngOnInit(): void {
    this.worker = new Worker('./worker-worker.ts');
    this.worker.onmessage = ({data}) => {
      const imageData = data.data;
      debugger
      this.previewCtx?.putImageData(imageData,0,0);
    }
  }

  ngAfterViewInit(){
    this.previewCtx = this.preview.nativeElement.getContext('2d')
  }

  getFile(){
    const file = this.input.nativeElement.files[0];
    createImageBitmap(file).then((bitmap) => {
      this.preview.nativeElement.height = bitmap.height;
      this.preview.nativeElement.width = bitmap.width;
      this.previewCtx?.drawImage(bitmap, 0, 0);
      this.applyFilter();
    });
  }

  applyFilter(){
    const imageData = this.previewCtx?.getImageData(0, 0, this.preview.nativeElement.width, this.preview.nativeElement.height);
    this.worker.postMessage(imageData, [imageData!.data.buffer]);
  }
}
