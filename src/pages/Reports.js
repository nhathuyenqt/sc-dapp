import React from 'react';
import {useState} from 'react'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import pdfFile from "./Research_Proposal.pdf"
import {Worker, Viewer} from '@react-pdf-viewer/core'

function Reports() {

  const [defaultPdfFile] = useState(pdfFile)
  const [numPages, setNumPages] = useState(null);


  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div className='reports'>
      <br></br>
      <h1>Reports</h1>
        <div>
        {defaultPdfFile&&<><Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
            <Viewer fileUrl={defaultPdfFile}
              plugins={[defaultLayoutPluginInstance]} />
          </Worker></>}
        </div>
    </div>
  );
}

export default Reports;