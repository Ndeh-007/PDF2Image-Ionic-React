import {
  IonCard,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useRef, useState, useEffect } from "react";
import { storage } from "../Firebase/Firebase";
import "./Home.css";

const Home: React.FC = () => {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [docImages, setDocImages] = useState<any[]>([]);
  useEffect(() => {
    window.addEventListener("message",(message)=>{console.log(message.data)},false)
  },[]);

  function checkStorage() {
    let file: any = localStorage.getItem("images");
    let object = JSON.parse(file);
    let arr = [];

    for (const property in object) {
      arr.push(object[property]);
    }
    setDocImages(arr);
  }

  storage
    .ref("files/sample.pdf")
    .getDownloadURL()
    .then((url) => {
      localStorage.setItem("file", url);
    });

  let src: string = `
  <html>
<body>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js"></script>
  <script type="text/javascript">
  var url = localStorage.getItem("file");
  console.log(url)
  var pages = [], heights = [], width = 0, height = 0, currentPage = 1;
  var scale = 1.5; 

function draw() {
    var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    for(var i = 0; i < pages.length; i++)
        ctx.putImageData(pages[i], 0, heights[i]);
    document.body.appendChild(canvas);
}

function sendResponse(value){
  window.postMessage(value,"*");
}

pdfjsLib.GlobalWorkerOptions.workerSrc= "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.js"
pdfjsLib.getDocument(url).promise.then(function (pdf) {
  var pgs = {}
  getPage();

    function getPage() {
        pdf.getPage(currentPage).then(function(page) {
            console.log("Printing " + currentPage);
            var viewport = page.getViewport({scale:1});
            var canvas = document.createElement('canvas') , ctx = canvas.getContext('2d');
            var renderContext = { canvasContext: ctx, viewport: viewport };

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            page.render(renderContext).promise.then(function() {
                pages.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

                heights.push(height);
                height += canvas.height;
                if (width < canvas.width) width = canvas.width;

                let dataURL = canvas.toDataURL();
                let pageIndex = "page_"+currentPage;
                pgs[pageIndex] = dataURL ;
                localStorage.setItem("images",JSON.stringify(pgs)); 

                
                sendResponse("complete")
                if (currentPage < pdf.numPages) {
                    currentPage++;
                    getPage();
                }
                else {
                  draw();
                }
            });
        });
    }
});
  </script>
</body>
</html> `;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>PDF from Firebase</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">PDF from Firebase</IonTitle>
          </IonToolbar>
        </IonHeader>
        <iframe
          src=""
          hidden
          frameBorder="0"
          title="pdfRender"
          srcDoc={src}
          allowFullScreen={true}
          width={`100%`}
          ref={iframe}
          onLoad={()=>{checkStorage()}}
        > 
        </iframe>

        {docImages.map((image, index) => {
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

// const MessageHandler: React.FC<{ allowedUrl: any; handleMessage: any }> = (
//   props
// ) => {
//   useEffect(() => {
//     const handleEvent = (event: any) => {
//       const { message, data, origin } = event;
//       if (origin === props.allowedUrl) {
//         props.handleMessage(message || data);
//       }
//     };

//     window.addEventListener("message", handleEvent, false);

//     return function cleanup() {
//       window.removeEventListener("message", handleEvent);
//     };
//   });

//   return <React.Fragment />;
// };

export default Home;
