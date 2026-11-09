import JSZip from 'jszip';
export const METRIC_DRAFT_LABEL='DRAFT — Proposed metrics require candidate verification; not for submission';
/** Keep review status outside resume JSON, visibly on every draft document page. */
export async function labelMetricDraftDocx(bytes:Uint8Array) {
 const zip=await JSZip.loadAsync(bytes);
 const paragraph=`<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0"/></w:pPr><w:r><w:rPr><w:color w:val="9C2727"/><w:sz w:val="14"/></w:rPr><w:t>${METRIC_DRAFT_LABEL}</w:t></w:r></w:p>`;
 let document=await zip.file('word/document.xml')!.async('string');
 if(document.includes('<w:footerReference')) {
  for(const name of Object.keys(zip.files).filter(n=>/^word\/footer\d+\.xml$/.test(n))) {
   const xml=await zip.file(name)!.async('string');zip.file(name,xml.replace('</w:ftr>',paragraph+'</w:ftr>'));
  }
 } else {
  zip.file('word/footerMetricDraft.xml',`<?xml version="1.0" encoding="UTF-8"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">${paragraph}</w:ftr>`);
  document=document.replace(/<w:sectPr([^>]*)>/g,'<w:sectPr$1><w:footerReference w:type="default" r:id="rIdMetricDraft"/>');
  zip.file('word/document.xml',document);
  const rel=await zip.file('word/_rels/document.xml.rels')!.async('string');
  zip.file('word/_rels/document.xml.rels',rel.replace('</Relationships>','<Relationship Id="rIdMetricDraft" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footerMetricDraft.xml"/></Relationships>'));
  const types=await zip.file('[Content_Types].xml')!.async('string');
  zip.file('[Content_Types].xml',types.replace('</Types>','<Override PartName="/word/footerMetricDraft.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>'));
 }
 return zip.generateAsync({type:'nodebuffer'});
}
