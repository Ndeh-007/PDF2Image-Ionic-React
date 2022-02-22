import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import { storage } from "../Firebase/Firebase";
import * as pdfjs from "pdfjs-dist";
import "./Home.css";

const Home4: React.FC = () => {
  const [docImages, setDocImages] = useState<any[]>([]);
  const [showLoading, setShowLoading] = useState(false);

  let paths = ["files/sample.pdf", "files/FE18A097.pdf"];

  var pages: any = [],
    heights: number[] = [],
    width = 0,
    height = 0,
    currentPage = 1;

  function draw() {
    var canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    for (var i = 0; i < pages.length; i++) {
      ctx?.putImageData(pages[i], 0, heights[i]);
    }
    // canvasHolder.current?.appendChild(canvas)
    document.body.appendChild(canvas);
  }

  function getURL(index: number) {
    storage
      .ref(paths[index])
      .getDownloadURL()
      .then((url) => {
        convertPDF(url);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  function convertPDF(url: string) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.js";

    pdfjs.getDocument(url).promise.then((pdf) => {
      var pgs: any[] = [];
      getPage();

      function getPage() {
        pdf.getPage(currentPage).then((page) => {
          //   console.log("Printing " + currentPage);
          // vary scale for clarity of text. Use 3 for optimum results. 
          // further testing may prove to yield better results
          var viewport = page.getViewport({ scale: 3 });
          var canvas = document?.createElement("canvas"),
            ctx = canvas?.getContext("2d");

          scaleCanvas(canvas, ctx, viewport.width, viewport.height);

          var renderContext: any = { canvasContext: ctx, viewport: viewport };

          page.render(renderContext).promise.then(() => {
            pages.push(ctx?.getImageData(0, 0, canvas.width, canvas.height));

            heights.push(height);
            height += canvas.height;
            if (width < canvas.width) width = canvas.width;

            let dataURL = canvas.toDataURL();
            pgs.push(dataURL);

            if (currentPage < pdf.numPages) {
              currentPage++;
              getPage();
            } else {
              setDocImages(pgs);
              draw();
              setShowLoading(false);
            }
          });
        });
      }
    });
  }
  // pdfjs.getDocument()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PDF from Firebase</IonTitle>
        </IonToolbar>
        {showLoading ? (
          <IonProgressBar type="indeterminate"></IonProgressBar>
        ) : (
          " "
        )}
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">PDF from Firebase</IonTitle>
          </IonToolbar>{" "}
          {showLoading ? (
            <IonProgressBar type="indeterminate"></IonProgressBar>
          ) : (
            " "
          )}
        </IonHeader>
        <IonButton
          onClick={() => {
            setShowLoading(true);
            getURL(0);
          }}
        >
          Fetch 1
        </IonButton>
        <IonButton
          onClick={() => {
            setShowLoading(true);
            getURL(1);
          }}
        >
          Fetch 2
        </IonButton>
        {/* <div ref={canvasHolder}></div> */}
        {docImages.map((image: string, index) => {
          return (
            <IonCard key={index}>
              <IonImg src={image}></IonImg>
            </IonCard>
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export function scaleCanvas(
  canvas: any,
  context: any,
  width: number,
  height: number
) {
  // assume the device pixel ratio is 1 if the browser doesn't specify it
  const devicePixelRatio = window.devicePixelRatio || 1;

  // determine the 'backing store ratio' of the canvas context
  const backingStoreRatio =
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;

  // determine the actual ratio we want to draw at
  const ratio = devicePixelRatio / backingStoreRatio;

  if (devicePixelRatio !== backingStoreRatio) {
    // set the 'real' canvas size to the higher width/height
    canvas.width = width * ratio;
    canvas.height = height * ratio;

    // ...then scale it back down with CSS
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
  } else {
    // this is a normal 1:1 device; just scale it simply
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "";
    canvas.style.height = "";
  }

  // scale the drawing context so everything will work at the higher ratio
  context.scale(ratio, ratio);
  console.log(context)
}

export default Home4;
