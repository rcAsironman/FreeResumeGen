import JSZip from "jszip";
import { dailyResumeFolder, resumeFileStem } from "@/utils/resume-download-name";

interface Directory {
  name:string;
  getDirectoryHandle(name:string,options:{create:boolean}):Promise<Directory>;
  getFileHandle(name:string,options?:{create:boolean}):Promise<{createWritable():Promise<{write(data:Blob):Promise<void>;close():Promise<void>}>}>;
}
let destination:Directory|null=null;
/** Must run during the download click, before fetching the generated document. */
export async function chooseBrowserDownloadFolder():Promise<Directory|null> {
  if(destination)return destination;
  const picker=(window as unknown as {showDirectoryPicker?:(options:object)=>Promise<Directory>}).showDirectoryPicker;
  if(!picker)return null;
  try {destination=await picker.call(window,{id:'resume-downloads',startIn:'downloads',mode:'readwrite'});return destination;}
  catch(error) {
    if(error instanceof DOMException&&error.name==='AbortError')throw new Error('Folder selection cancelled. No file was downloaded.');
    // Unsupported or denied directory access still permits a standard ZIP download.
    return null;
  }
}

export async function saveBrowserResume(blob:Blob,name:string,format:'pdf'|'docx'|'json',folder:Directory|null,customStem?:string) {
  const dateFolder=dailyResumeFolder();
  const save=async()=>{
    if(folder) {
      const day=await folder.getDirectoryHandle(dateFolder,{create:true});
      for(let index=0;index<10000;index++) {
        const stem=resumeFileStem(name,index,customStem);
        let exists=false;
        for(const extension of ['pdf','docx','json']) {
          try {await day.getFileHandle(`${stem}.${extension}`);exists=true;break;}
          catch(error) {if(!(error instanceof DOMException&&error.name==='NotFoundError'))throw error;}
        }
        if(exists)continue;
        const filename=`${stem}.${format}`;
        const file=await day.getFileHandle(filename,{create:true});
        const stream=await file.createWritable();await stream.write(blob);await stream.close();
        return `Saved to ${folder.name}/${dateFolder}/${filename} on this device.`;
      }
      throw new Error('No unused resume filename is available in this folder.');
    }
    const key=`resume-download-index:${dateFolder}:${customStem ?? name}`;
    let index=0;try{index=Number(localStorage.getItem(key))||0;}catch{}
    const filename=`${resumeFileStem(name,index,customStem)}.${format}`;
    const zip=new JSZip();zip.file(`${dateFolder}/${filename}`,await blob.arrayBuffer());
    const archive=await zip.generateAsync({type:'blob'});
    const url=URL.createObjectURL(archive);const link=document.createElement('a');
    link.href=url;link.download=`${dateFolder}_${resumeFileStem(name,index,customStem)}.zip`;
    document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
    try{localStorage.setItem(key,String(index+1));}catch{}
    return `Download started: ${link.download}. Extract it to get ${dateFolder}/${filename}. Your browser controls the download location.`;
  };
  return navigator.locks?navigator.locks.request('resume-browser-download',save):save();
}
