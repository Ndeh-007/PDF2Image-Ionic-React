import {
    IonCard,
    IonContent,
    IonHeader,
    IonImg,
    IonPage,
    IonTitle,
    IonToolbar,
  } from "@ionic/react";
  import React, { useRef, useState } from "react";
  import { storage } from "../Firebase/Firebase";
  import "./Home.css";
  
  const Home3: React.FC = () => {
    const iframe = useRef<HTMLIFrameElement>(null);
    const [docImages, setDocImages] = useState<any[]>([]);
    const [intIndicator, setintIndicator] = useState<boolean>(true);
  
    let intervalIndicator = 0;
    let intervalID = setInterval(() => {
      let item = localStorage.getItem("images");
      if (item === null) {
        console.log("Images not set to local storage");
      } else {
        if (intervalIndicator === 1) {
          console.log("Interval Cleared 2nd run - Parent Window ");
          checkStorage(item);
          return;
        }else{
          console.log(intervalIndicator)
          intervalIndicator = intervalIndicator + 1; 
          clearInterval(intervalID);
          console.log("Interval Cleared 1st run - Parent Window");
        }
      }
    }, 200);
  
    function checkStorage(file: string) {
      let object = JSON.parse(file);
      let arr = [];
  
      for (const property in object) {
        arr.push(object[property]);
      }
      arr.pop();
      setDocImages(arr);
    }
  
    storage
      .ref("files/FE18A097.pdf")
      .getDownloadURL()
      .then((url) => {
        localStorage.setItem("file", url);
      });
  
    let src: string = `
    <html>
  <body>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.min.js"></script>
    <script type="text/javascript">
    pdfjsLib.GlobalWorkerOptions.workerSrc= "https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.js" 
    var pages = [], heights = [], width = 0, height = 0, currentPage = 1; 
    let indicator = 0;
  
    function draw() {
        var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;
        for(var i = 0; i < pages.length; i++)
            ctx.putImageData(pages[i], 0, heights[i]);
        document.body.appendChild(canvas);
    }
  
    function convertPDF(url){
      pdfjsLib.getDocument(url).promise.then(function (pdf) {
        var pgs = {}
        getPage();
      
          function getPage() {
              pdf.getPage(currentPage).then(function(page) {
                  // console.log("Printing " + currentPage);
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
       
                      if (currentPage < pdf.numPages) {
                          currentPage++;
                          getPage();
                        }
                        else {
                          switch(indicator){
                            case 0:
                                clearInterval(intID);
                                ++indicator;
                                console.log("Interval Cleared 1st run - Iframe Window ");
                              break;
                            case 1:
                                localStorage.setItem("images",JSON.stringify(pgs)); 
                                draw();
                                ++indicator;
                                console.log("Interval Cleared 2nd run - Iframe Window ");
                              break;
                            default:
                              console.log("case default");
                              
                          }
                          // if(indicator === 1){
                          //   localStorage.setItem("images",JSON.stringify(pgs)); 
                          //   draw();
                          //   console.log("Interval Cleared 2nd run - Iframe Window ");
                          // }else{
                          //   clearInterval(intID);
                          //   indicator = indicator + 1;
                          //   console.log("Interval Cleared 1st run - Iframe Window ");
                          // }
                      }
                  });
              });
          }
      });
    }
  
    let intID = setInterval(()=>{ 
    var url = localStorage.getItem("file");
    if(url === null){
        console.log("waiting for url")
    }else{
      convertPDF(url)
      }
    },200)
  
   
    </script>
  </body>
  </html>
    `;
  
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
            hidden
            frameBorder="0"
            title="pdfRender"
            srcDoc={src}
            width={`100%`}
            height={`100%`}
            ref={iframe}
          >
            {/* <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.12.313/build/pdf.worker.js"></script>
              */}
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
  
  export default Home3;
  